import client from "../config/db.mongoos.js"
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
export const checkpointer =
    new MongoDBSaver({
        client,
        dbName: "electra_ai",
    });