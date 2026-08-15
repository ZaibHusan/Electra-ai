import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["whatsapp", "messenger", "instagram", "web"],
      required: true,
    },
    isAutoMode: {
      type: Boolean,
      default: true,
    },
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    // --- READ STATUS FIELDS ---
    unreadCount: {
      type: Number,
      default: 0, // Counts unread messages waiting for human admin
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema, "conversations");