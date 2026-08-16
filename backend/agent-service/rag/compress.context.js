export const compressContext = (documents) => {
    if (!documents || documents.length === 0) {
        return "No relevant documentation context found.";
    }

    return documents
        .map((doc, index) => `[Document Source ${index + 1}]:\n${doc.pageContent}`)
        .join("\n\n---\n\n");
};