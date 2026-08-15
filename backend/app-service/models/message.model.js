import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Links back to the Conversation
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true, // Crucial for fast lookups in loadMemoryNode!
    },
    metaMessageId: {
      type: String,
      unique: true,
      sparse: true // sparse means it allows nulls (since AI/Human replies won't have a Meta ID)
    },
    // Who sent it? 
    // 'user' = the customer, 'ai' = Electra AI, 'human' = your team member
    senderRole: {
      type: String,
      enum: ['user', 'ai', 'human'],
      required: true,
    },
    // The actual content
    text: {
      type: String,
      required: true,
    },
    // Optional: Keep track of which specific team member sent a manual reply
    humanAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model for your team
      required: false,
    }
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  }
);

export default mongoose.model("Message", messageSchema, "messages");