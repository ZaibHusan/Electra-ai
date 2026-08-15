import mongoose from "mongoose";

// LEAN SCHEMA: The AI doesn't care about the UI preview text or timestamps
const conversationSchema = new mongoose.Schema({
    customerId: { 
        type: String, 
        required: true 
    },
    isAutoMode: { 
        type: Boolean 
    }
});

// CRITICAL: Must match the "conversations" collection exactly
export default mongoose.model("Conversation", conversationSchema, "conversations");