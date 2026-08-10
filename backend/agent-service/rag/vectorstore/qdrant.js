import { QdrantVectorStore } from "@langchain/qdrant";

import qdrantClient from "../../config/db.qdrant.js";
import embeddings from "../embeddings/embeddings.js";

const COLLECTION_NAME = "electra_docs";

const createVectorStore = async (documents) => {

    const vectorStore = await QdrantVectorStore.fromDocuments(
        documents,
        embeddings,
        {
            client: qdrantClient,
            collectionName: COLLECTION_NAME,
        }
    );

    console.log(
        `Vector store created: ${COLLECTION_NAME}`
    );

    return vectorStore;
};

export default createVectorStore;