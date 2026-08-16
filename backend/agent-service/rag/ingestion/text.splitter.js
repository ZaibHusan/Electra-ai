import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"; // ✅ Correct modular package

export const splitDocuments = async (documents) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const chunks = await splitter.splitDocuments(documents);
    return chunks;
};