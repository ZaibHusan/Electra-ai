import qdrantClient from "../../config/db.qdrant.js";

import KnowledgeSource from "../../memory/models/KnowledgeSource.js";

const COLLECTION_NAME = "electra_docs";

export const clearAllKnowledge = async () => {
    try {
        // 1. Delete all records from MongoDB metadata
        await KnowledgeSource.deleteMany({});

        // 2. Delete the entire collection from Qdrant vector database
        const collections = await qdrantClient.getCollections();
        const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

        if (exists) {
            await qdrantClient.deleteCollection(COLLECTION_NAME);
            console.log(`[Qdrant] Collection '${COLLECTION_NAME}' deleted successfully.`);
        }

        return { success: true, message: "All knowledge sources and vector stores cleared successfully." };
    } catch (error) {
        console.error("[Clear Database Error]:", error.message);
        throw new Error("Failed to clear RAG database.");
    }
};