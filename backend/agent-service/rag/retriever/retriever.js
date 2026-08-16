import { QdrantVectorStore } from "@langchain/qdrant";
import qdrantClient from "../../config/db.qdrant.js";
import embeddings from "../embeddings/embeddings.js";

const COLLECTION_NAME = "electra_docs";

export const retrieveDocuments = async (query, k = 4) => {
    try {
        // Check if collection exists first to prevent crashes on fresh databases
        const collections = await qdrantClient.getCollections();
        const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

        if (!exists) {
            console.warn(`[Retriever] Collection '${COLLECTION_NAME}' does not exist yet. Skipping RAG.`);
            return [];
        }

        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                client: qdrantClient,
                collectionName: COLLECTION_NAME,
            }
        );

        const results = await vectorStore.similaritySearchWithScore(query, k);
        return results;
    } catch (error) {
        console.error("[Retriever Error]:", error.message);
        return [];
    }
};