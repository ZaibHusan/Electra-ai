import mongoose from "mongoose";

// LEAN SCHEMA: Only the fields the LangGraph agent needs to read
const messageSchema = new mongoose.Schema({
    conversationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    senderRole: { 
        type: String, 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date 
    } // We need this to sort the last 20 messages!
});

// CRITICAL: The 3rd argument "messages" forces this model to read the 
// exact same database collection that app-service is writing to.
export default mongoose.model("Message", messageSchema, "messages");