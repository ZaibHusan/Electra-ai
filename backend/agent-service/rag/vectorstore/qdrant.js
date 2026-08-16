import { QdrantVectorStore } from "@langchain/qdrant";
import qdrantClient from "../../config/db.qdrant.js";
import embeddings from "../embeddings/embeddings.js";

const COLLECTION_NAME = "electra_docs";

export const createVectorStore = async (documents) => {
    const vectorStore = await QdrantVectorStore.fromDocuments(
        documents,
        embeddings,
        {
            client: qdrantClient,
            collectionName: COLLECTION_NAME,
        }
    );

    console.log(`[VectorStore] Successfully vectorized and stored chunks into collection: ${COLLECTION_NAME}`);
    return vectorStore;
};