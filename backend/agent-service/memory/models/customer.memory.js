import mongoose from "mongoose";

const customerMemorySchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
    },

    leadScore: {
      type: Number,
      default: 0,
    },

    stage: {
      type: String,
      default: "NEW",
    },

    summary: {
      type: String,
      default: "",
    },

    facts: {
      name: String,
      city: String,
      phone: String,
      budget: String,
      product: String,
    },




    leadStatus: {
      type: String,
      default: "NEW",
    },

  
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "CustomerMemory",
  customerMemorySchema
);