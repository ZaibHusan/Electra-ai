import { Document } from "@langchain/core/documents";
import { loadPDF } from "./pdf.loader.js";
import { splitDocuments } from "./text.splitter.js";
import { createVectorStore } from "../vectorstore/qdrant.js";
import qdrantClient from "../../config/db.qdrant.js";

import KnowledgeSource from "../../memory/models/KnowledgeSource.js";
import fs from 'fs';

const COLLECTION_NAME = "electra_docs";

export const ingestData = async ({ title, type, textContent, filePath }) => {
    let rawDocuments = [];

    try {
        if (type === 'text' && textContent) {
            rawDocuments = [new Document({ pageContent: textContent, metadata: { title } })];
        } else if (type === 'pdf' && filePath) {
            rawDocuments = await loadPDF(filePath);
        } else {
            throw new Error("Invalid payload: Provide either textContent for text or a valid PDF file.");
        }

        const chunks = await splitDocuments(rawDocuments);

        const knowledgeRecord = await KnowledgeSource.create({
            title,
            type,
            content: type === 'text' ? textContent : undefined,
            filePath: type === 'pdf' ? filePath : undefined,
        });

        const chunksWithMetadata = chunks.map(chunk => ({
            ...chunk,
            metadata: {
                ...chunk.metadata,
                sourceId: knowledgeRecord._id.toString(),
                title: title
            }
        }));

        await createVectorStore(chunksWithMetadata);

        return {
            success: true,
            message: `Successfully ingested ${chunks.length} chunks from ${type} source.`,
            recordId: knowledgeRecord._id
        };
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error("[Cleanup Warning] Failed to delete temp file:", err.message);
            }
        }
    }
};

export const deleteIngestedData = async (id) => {
    const record = await KnowledgeSource.findById(id);
    if (!record) {
        throw new Error("Knowledge source record not found.");
    }

    try {
        await qdrantClient.delete(COLLECTION_NAME, {
            filter: {
                must: [
                    {
                        key: "metadata.sourceId",
                        match: {
                            value: id.toString()
                        }
                    }
                ]
            }
        });
    } catch (qdrantError) {
        console.error("[Qdrant Deletion Error]:", qdrantError.message);
    }

    await KnowledgeSource.findByIdAndDelete(id);

    return {
        success: true,
        message: `Successfully deleted knowledge source '${record.title}' from database and Qdrant.`
    };
};

export const getAllKnowledgeSources = async () => {
    return await KnowledgeSource.find().sort({ createdAt: -1 });
};

export const clearAllKnowledge = async () => {
    try {
        await KnowledgeSource.deleteMany({});

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