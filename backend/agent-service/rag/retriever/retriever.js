import { QdrantVectorStore } from "@langchain/qdrant";

import qdrantClient from "../../config/db.qdrant.js";
import embeddings from "../embeddings/embeddings.js";


const COLLECTION_NAME = "electra_docs";


const getvectorStore = async () => {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            client: qdrantClient,
            collectionName: COLLECTION_NAME,
        }
    );

    return vectorStore;
}



export const retrieveDocuments =
async (query, k = 8) => {

  const vectorStore =
    await getvectorStore();

  const results =
    await vectorStore
      .similaritySearchWithScore(
        query,
        k
      );

  return results;
};
