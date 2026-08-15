import { callAgent } from "./agent.service.js";
import { sendMessage } from "./meta.service.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { getIO } from "../sockets/socket.js"; // 🔥 Import Socket.io helper

export const handleWebhook = async (body) => {
    const platform = detectPlatform(body);
    const senderId = GetsenderId(body, platform);
    const messageText = getMessage(body, platform);
    const metaMessageId = GetMetaMessageId(body, platform);

    if (!messageText || !senderId || !metaMessageId) return;

    try {
        // 1. Deduplication check
        const isDuplicate = await Message.exists({ metaMessageId });
        if (isDuplicate) return;

        // 2. Find or create conversation
        let conversation = await Conversation.findOne({ customerId: senderId });

        if (!conversation) {
            conversation = await Conversation.create({
                customerId: senderId,
                source: platform,
                isAutoMode: true,
                unreadCount: 1, // First message is unread
            });
        }

        // 3. Save incoming customer message
        const userMessage = await Message.create({
            conversationId: conversation._id,
            senderRole: 'user',
            text: messageText,
            metaMessageId: metaMessageId
        });

        // 4. Update Conversation: set last message & increment unread counter
        await Conversation.findByIdAndUpdate(conversation._id, {
            lastMessage: messageText,
            lastMessageAt: userMessage.createdAt,
            $inc: { unreadCount: 1 } // Increment unread count by 1
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

        // 5. Handle AI reply if Auto Mode is ON
        if (conversation.isAutoMode) {
            const replyText = await callAgent(senderId, messageText);

            if (replyText) {
                const aiMessage = await Message.create({
                    conversationId: conversation._id,
                    senderRole: 'ai',
                    text: replyText
                });

                // Update lastMessage preview with AI response AND clear unread count
                await Conversation.findByIdAndUpdate(conversation._id, {
                    lastMessage: replyText,
                    lastMessageAt: aiMessage.createdAt,
                    unreadCount: 0, // AI handled it, so mark as read!
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

function GetimgUrl(body, platform) {
    let imgUrl;
    if (platform === "messenger" || platform === "instagram") {
        imgUrl = body.entry?.[0]
            ?.messaging?.[0]
            ?.message?.attachments?.[0]
            ?.payload?.url
    }

    if (imgUrl) {
        console.log("imgUrl", imgUrl);
    }
    return imgUrl
}

function GetVoiceUrl(body, platform) {
    let voiceUrl;
    if (platform === "messenger" || platform === "instagram") {
        const attachment = body.entry?.[0]
            ?.messaging?.[0]
            ?.message?.attachments?.[0];

        if (attachment?.type === "audio") {
            voiceUrl = attachment?.payload?.url;
        }
    }

    if (voiceUrl) {
        console.log("voiceUrl", voiceUrl);
    }
    return voiceUrl
}

function detectPlatform(body) {
    if (body.object === "whatsapp_business_account") {
        return "whatsapp";
    }
    if (body.object === "instagram") {
        return "instagram";
    }
    if (body.object === "page") {
        return "messenger";
    }
    return null;
}

function GetsenderId(body, platform) {
    if (platform === "whatsapp") {
        return body.entry?.[0]
            ?.changes?.[0]
            ?.value?.messages?.[0]
            ?.from;
    }
    if (platform === "messenger") {
        return body.entry?.[0]
            ?.messaging?.[0]
            ?.sender?.id;
    }

    return body.entry?.[0]
        ?.messaging?.[0]
        ?.sender?.id;
}

function getMessage(body, platform) {
    const msg = body.entry?.[0]?.messaging?.[0]?.message;

    if ((platform === "messenger" || platform === "instagram") && msg?.is_echo) {
        if (msg.app_id !== process.env.MY_APP_ID) {
            console.log("Human reply detected — pausing bot for this user");
            // e.g. markUserAsHumanHandled(senderId)
        }
        return null; // still don't process the echo as a customer message
    }

    if (platform === "whatsapp") {
        return body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
    }

    return msg?.text ?? null;
}

function GetMetaMessageId(body, platform) {
    if (platform === "whatsapp") {
        return body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id;
    }
    // Messenger and Instagram both use 'mid'
    return body.entry?.[0]?.messaging?.[0]?.message?.mid;
}