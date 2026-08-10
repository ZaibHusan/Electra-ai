import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { tools } from "../tools/rag.tool.js";

dotenv.config();

const groq = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});

// Bind the RAG tool to each model so it can decide on its own,
// per message, whether it needs to call search_products.
const groqWithTools = groq.bindTools(tools, {
  tool_choice: "auto",
});
const geminiWithTools = gemini.bindTools(tools, {
  tool_choice: "auto",
});

export const GetLlmModel = (provider = "groq") => {
  return provider === "groq" ? groqWithTools : geminiWithTools;
};