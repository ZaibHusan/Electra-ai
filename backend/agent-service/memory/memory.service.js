import CustomerMemory from "./models/customer.memory.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";

export const loadMemory = async (customerId) => {
    // 1. Load or initialize CustomerMemory
    let memory = await CustomerMemory.findOne({ customerId });

    if (!memory) {
        memory = await CustomerMemory.create({
            customerId,
        });
    }

    // 2. Fetch the Conversation ID for this customer
    const conversation = await Conversation.findOne({ customerId }).lean();

    let recentMessages = [];

    if (conversation) {
        // 3. Fetch the last 20 messages for this conversation
        const rawMessages = await Message.find({ conversationId: conversation._id })
            .sort({ createdAt: -1 }) // Get latest messages first
            .limit(20)
            .lean();

        // 4. Reverse to put them in chronological order (oldest -> newest) & map format
        recentMessages = rawMessages.reverse().map((msg) => ({
            role: msg.senderRole, // 'user' | 'ai' | 'human'
            content: msg.text,
            timestamp: msg.createdAt,
        }));
    }

    // 5. Convert memory doc to plain object and attach lastMessages
    const memoryObj = memory.toObject ? memory.toObject() : memory;
    memoryObj.lastMessages = recentMessages;

    return memoryObj;
};