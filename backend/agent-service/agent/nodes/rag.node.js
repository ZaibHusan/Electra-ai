import { compressContext }
from "../../rag/compress.context.js";

import {
  retrieveDocuments
}
from "../../rag/retriever/retriever.js";

export const ragNode =
async (state) => {

  const results =
    await retrieveDocuments(
      state.router.ragQuery
    );

  const docs =
    results
      .filter(
        ([_, score]) =>
          score < 0.7
      )
      .map(
        ([doc]) => doc
      );

  const ragContext =
    compressContext(docs);

  return {
    ...state,
    ragContext,
    ragConfidence:
      docs.length
  };
};