import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.resolve(
    __dirname,
    "../../documents/company.pdf"
);

console.log("Loading PDF:", pdfPath);

const loader = new PDFLoader(pdfPath);

const loadPDF = async () => {
    const docs = await loader.load();

    console.log(`PDF loaded: ${docs.length} pages`);

    return docs;
};

export default loadPDF;