import {
    RecursiveCharacterTextSplitter
} from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const splitDocuments = async (documents) => {

    const chunks = await splitter.splitDocuments(documents);

    console.log(`Documents split into ${chunks.length} chunks`);

    return chunks;
};

export default splitDocuments;