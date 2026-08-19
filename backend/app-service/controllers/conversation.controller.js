import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { sendMessage } from "../services/meta.service.js";
export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find()
            .sort({ lastMessageAt: -1 })
            .lean();

        const formattedConversations = conversations.map(chat => ({
            id: chat._id,
            customerId: chat.customerId,
            name: chat.customerName || chat.customerId,
            isAutoMode: chat.isAutoMode,
            lastMessage: chat.lastMessage,
            time: chat.lastMessageAt,
            source: chat.source,
            unreadCount: chat.unreadCount || 0, // Used for sidebar red badge
            lastReadAt: chat.lastReadAt
        }));

        return res.status(200).json({
            success: true,
            conversations: formattedConversations
        });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch conversations" });
    }
};


export const markAsRead = async (req, res) => {
    try {
        const { id: conversationId } = req.params;

        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                unreadCount: 0,
                lastReadAt: new Date()
            },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        return res.status(200).json({
            success: true,
            conversationId: conversation._id,
            unreadCount: 0
        });
    } catch (error) {
        console.error("Error marking conversation as read:", error);
        return res.status(500).json({ success: false, message: "Failed to mark as read" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;

        // Fetch messages for this conversation, ordered from oldest to newest for UI display
        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 })
            .lean();

        const formattedMessages = messages.map(msg => ({
            id: msg._id,
            conversationId: msg.conversationId,
            senderRole: msg.senderRole, // 'user' | 'ai' | 'human'
            text: msg.text,
            timestamp: msg.createdAt
        }));

        return res.status(200).json({
            success: true,
            messages: formattedMessages
        });

    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};


// 3. SEND HUMAN MESSAGE (Reset unread count since human is active)
export const sendHumanMessage = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const { text, humanAgentId } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ success: false, message: "Message text is required" });
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }


        // Send to platform (WhatsApp, Messenger, Instagram)
        await sendMessage(
            conversation.source,
            conversation.customerId,
            text
        );

        // Save human message
        const newMessage = await Message.create({
            conversationId,
            senderRole: 'human',
            text,
            humanAgentId: humanAgentId || null
        });

        // Update preview AND clear unreadCount
        conversation.isAutoMode = false;
        conversation.lastMessage = text;
        conversation.lastMessageAt = newMessage.createdAt;
        conversation.unreadCount = 0; // Sending a reply means all incoming messages are read
        conversation.lastReadAt = new Date();
        await conversation.save();

        return res.status(201).json({
            success: true,
            message: {
                id: newMessage._id,
                conversationId: newMessage.conversationId,
                senderRole: newMessage.senderRole,
                text: newMessage.text,
                timestamp: newMessage.createdAt
            }
        });

    } catch (error) {
        console.error("Error sending human message:", error);
        return res.status(500).json({ success: false, message: "Failed to send message via platform" });
    }
};




export const toggleMode = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const { isAutoMode } = req.body;

        if (typeof isAutoMode !== 'boolean') {
            return res.status(400).json({ success: false, message: "isAutoMode boolean field is required" });
        }

        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { isAutoMode },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        return res.status(200).json({
            success: true,
            conversationId: conversation._id,
            isAutoMode: conversation.isAutoMode
        });

    } catch (error) {
        console.error("Error toggling conversation mode:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update conversation mode"
        });
    }
};