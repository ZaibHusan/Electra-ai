import { compressContext } from "../../rag/compress.context.js";
import { retrieveDocuments } from "../../rag/retriever/retriever.js";
import getTokens from "../../utils/getToken.js";

export const ragNode = async (state) => {
  const results = await retrieveDocuments(state.router.ragQuery);

  console.log("[RAG] Retrieved results:", results);

  const docs = results
    .filter(([_, score]) => score < 0.7) // keep only high-confidence matches
    .map(([doc]) => doc);

  console.log(`[RAG] ${docs.length} docs after threshold`);

  const ragContext = compressContext(docs);
  console.log("[RAG] Context length:", ragContext.length);
  // Token count from context (not from raw results)
  const token = ragContext ? await getTokens(ragContext) : 0;
  const currentToken = state.totalTokens || 0;

  return {
    ...state,
    ragContext,
    ragConfidence: docs.length,
    totalTokens: currentToken + token,
  };
};