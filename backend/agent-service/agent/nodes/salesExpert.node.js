import {
  HumanMessage,
  SystemMessage
} from "@langchain/core/messages";

import { GetLlmModel } from "../../llm/model.js";

import {
  SALES_EXPERT_PROMPT
} from "../../prompt/salesExpert.prompt.js";

export const salesExpertNode =
  async (state) => {

    const llm =
      GetLlmModel("gemini");

    const result =
      await llm.invoke([
        new SystemMessage(
          SALES_EXPERT_PROMPT
        ),

        new HumanMessage(`
Customer Message:
${state.message}

Customer Memory:
${JSON.stringify(
          state.memory
        )}

 ragConfidence:
${state.ragConfidence}

Sales Analysis:
${JSON.stringify(
          state.router
        )}

Knowledge:
${state.ragContext}
`)
      ]);

    return {
      ...state,

      response:
        result.content
    };
  };