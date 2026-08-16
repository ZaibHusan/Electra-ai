const AGENT_URL = process.env.AGENT_URL || "http://localhost:3000";

export const ragAdminService = {
    // Get all knowledge sources
    async getSources() {
        const response = await fetch(`${AGENT_URL}/api/rag/sources`);
        if (!response.ok) throw new Error("Failed to fetch knowledge sources");
        const data = await response.json();
        return data;
    },

    // Ingest text or PDF
    async ingestSource(payload, file) {
        let response;

        if (file) {
            // Create FormData to forward the file
            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('type', payload.type);
            formData.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);

            response = await fetch(`${AGENT_URL}/api/rag/ingest`, {
                method: "POST",
                body: formData
            });
        } else {
            // Forward as JSON for text content
            response = await fetch(`${AGENT_URL}/api/rag/ingest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) throw new Error("Failed to ingest source");
        return await response.json();
    },

    // Delete a specific source
    async deleteSource(sourceId) {
        const response = await fetch(`${AGENT_URL}/api/rag/ingest/${sourceId}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete source");
        return await response.json();
    },

    // Clear all data
    async clearAllData() {
        const response = await fetch(`${AGENT_URL}/api/rag/clear`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to clear RAG database");
        return await response.json();
    }
};