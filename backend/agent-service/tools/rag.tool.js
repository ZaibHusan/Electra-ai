import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { retrieveDocuments as retriever } from "../rag/retriever/retriever.js";

console.log("RAG tool loaded");

// ==========================================
// 1. TOOL DEFINITIONS
// ==========================================

const ragTool = tool(
  async ({ query }) => {
    console.log("================================");
    console.log("RAG TOOL EXECUTED");
    console.log("Query:", query);
    console.log("================================");

    const docs = await retriever.invoke(query, 5);

    console.log("Documents retrieved:", docs.length);

    if (!docs || docs.length === 0) {
      return "NO_RELEVANT_INFORMATION_FOUND";
    }

    return docs
      .map((doc) => doc.pageContent)
      .join("\n\n");
  },
  {
    name: "knowledge_base_search",
    description:
      "Search the internal knowledge base for information specifically about the GUARDEER Trading Course, mentorship details, pricing, session lists, payment methods, and access policies. ALWAYS pass the query in English.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "A clear, specific search query translated into English representing the information the user is asking for regarding the GUARDEER course."
        ),
    }),
  }
);

export const tools = [ragTool];