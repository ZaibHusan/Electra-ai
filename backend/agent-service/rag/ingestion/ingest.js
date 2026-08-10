import loadPDF from "./pdf.loader.js";
import splitDocuments from "./text.splitter.js";
import createVectorStore from "../vectorstore/qdrant.js";
import clearCollection from "./clear.database.js";

const ingestDocuments = async () => {

    console.log("Starting RAG ingestion...");

    await clearCollection();

    const documents =
        await loadPDF();

    const chunks =
        await splitDocuments(
            documents
        );

    await createVectorStore(
        chunks
    );

    console.log(
        "RAG ingestion completed."
    );
};

export default ingestDocuments;