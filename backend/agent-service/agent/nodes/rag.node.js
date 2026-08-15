import { compressContext }
  from "../../rag/compress.context.js";

import {
  retrieveDocuments
}
  from "../../rag/retriever/retriever.js";
import getTokens from "../../utils/getToken.js";

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

    const token = await getTokens(results);
    const currentToken = state.totalTokens || 0;
    return {
      ...state,
      ragContext,
      ragConfidence:
        docs.length,
      totalTokens: currentToken + token
    };
  };