export const compressContext =
(docs) => {

 return docs
   .slice(0, 4)
   .map(doc =>
      doc.pageContent
   )
   .join("\n\n");
};