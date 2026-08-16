// test-qdrant.js
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
    url: "https://7ac8c981-8cd4-4215-94d8-ce29336917ad.us-central1-0.gcp.cloud.qdrant.io",
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
});

try {
    const collections = await client.getCollections();
    console.log("Connected! Collections:", collections);
} catch (error) {
    console.error("Connection failed:", error.message);
}