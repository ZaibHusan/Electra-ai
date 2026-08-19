import { callAgent } from "./agent.service.js";
import { sendMessage } from "./meta.service.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import SystemSettings from "../models/systemSettings.model.js";
import { getIO } from "../sockets/socket.js";

export const handleWebhook = async (body) => {
    const platform = detectPlatform(body);

    // 1. Check for human echo messages first (Instagram / Messenger)
    if ((platform === "messenger" || platform === "instagram")) {
        const msg = body.entry?.[0]?.messaging?.[0]?.message;
        if (msg?.is_echo) {
            // If it's not sent by your bot app, it's a human admin reply!
            if (msg.app_id !== process.env.MY_APP_ID) {
                const customerId = body.entry?.[0]?.messaging?.[0]?.recipient?.id;
                if (customerId) {
                    console.log(`[Human Override] Human reply detected for customer ${customerId}. Turning off Auto Mode.`);
                    await Conversation.findOneAndUpdate(
                        { customerId },
                        { isAutoMode: false }
                    );
                }
            }
            return // Exit completely, never process echo as customer message
        }
    }

    const senderId = GetsenderId(body, platform);
    const messageText = getMessage(body, platform);
    const metaMessageId = GetMetaMessageId(body, platform);

    if (!messageText || !senderId || !metaMessageId) return;

    try {
        // 2. Deduplication check
        const isDuplicate = await Message.exists({ metaMessageId });
        if (isDuplicate) return;

        // 3. Check Global Kill Switch state from DB
        const systemSettings = await SystemSettings.findOne({ key: 'AI_SYSTEM_STATE' });
        const isGlobalAiActive = systemSettings ? systemSettings.isActive : true;

        // 4. Find or create conversation
        let conversation = await Conversation.findOne({ customerId: senderId });

        if (!conversation) {
            conversation = await Conversation.create({
                customerId: senderId,
                source: platform,
                isAutoMode: true,
                unreadCount: 1, 
            });
        }

        // 5. Save incoming customer message
        const userMessage = await Message.create({
            conversationId: conversation._id,
            senderRole: 'user',
            text: messageText,
            metaMessageId: metaMessageId
        });

        // 6. Update Conversation: set last message & increment unread counter
        await Conversation.findByIdAndUpdate(conversation._id, {
            lastMessage: messageText,
            lastMessageAt: userMessage.createdAt,
            $inc: { unreadCount: 1 } 
        });

        // 🔥 PUSH TO FRONTEND: New Customer Message
        getIO().to("admin_dashboard").emit("receive_new_message", {
            conversationId: conversation._id,
            message: {
                id: userMessage._id,
                senderRole: 'user',
                text: userMessage.text,
                timestamp: userMessage.createdAt
            }
        });

        // 7. Handle AI reply only if BOTH Global AI & Per-User Auto Mode are ON
        if (isGlobalAiActive && conversation.isAutoMode) {
            const replyText = await callAgent(senderId, messageText);

            if (replyText) {
                const aiMessage = await Message.create({
                    conversationId: conversation._id,
                    senderRole: 'ai',
                    text: replyText
                });

                await Conversation.findByIdAndUpdate(conversation._id, {
                    lastMessage: replyText,
                    lastMessageAt: aiMessage.createdAt,
                    unreadCount: 0, 
                    lastReadAt: new Date()
                });

                // Send to Meta
                await sendMessage(platform, senderId, replyText);

                // 🔥 PUSH TO FRONTEND: New AI Reply
                getIO().to("admin_dashboard").emit("receive_new_message", {
                    conversationId: conversation._id,
                    message: {
                        id: aiMessage._id,
                        senderRole: 'ai',
                        text: aiMessage.text,
                        timestamp: aiMessage.createdAt
                    }
                });
            }
        } else {
            console.log(`[AI Skipped] Global AI Active: ${isGlobalAiActive} | User Auto Mode: ${conversation.isAutoMode}`);
        }
    } catch (error) {
        if (error.code !== 11000) {
            console.error("Error in handleWebhook processing:", error);
        }
    }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function detectPlatform(body) {
    if (body.object === "whatsapp_business_account") return "whatsapp";
    if (body.object === "instagram") return "instagram";
    if (body.object === "page") return "messenger";
    return null;
}

function GetsenderId(body, platform) {
    if (platform === "whatsapp") {
        return body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    }
    return body.entry?.[0]?.messaging?.[0]?.sender?.id;
}

function getMessage(body, platform) {
    const msg = body.entry?.[0]?.messaging?.[0]?.message;

    if (platform === "whatsapp") {
        return body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
    }

    return msg?.text ?? null;
}

function GetMetaMessageId(body, platform) {
    if (platform === "whatsapp") {
        return body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id;
    }
    return body.entry?.[0]?.messaging?.[0]?.message?.mid;
}