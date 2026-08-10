import { MongoClient } from "mongodb";

import dotenv from "dotenv";

dotenv.config();



const client = new MongoClient(
  process.env.MONGODB_URI
);

try {

  await client.connect();

  console.log(
    "MongoDB Connected Successfully"
  );

} catch (error) {

  console.error(
    "MongoDB Connection Error:",
    error
  );

  process.exit(1);
}

export default client;