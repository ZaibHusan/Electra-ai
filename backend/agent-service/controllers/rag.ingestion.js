import ingestDocuments from "../rag/ingestion/ingest.js";


const ingestDoc = async (req, res) => {
    try {
        await ingestDocuments();
        return res.status(200).json({ success: true, message: "Ingestion completed" });
    } catch (error) {
        console.error("Error ingesting documents:", error);
        return res.status(500).json({ success: false, message: "Error ingesting documents" });
    }
}

export default ingestDoc