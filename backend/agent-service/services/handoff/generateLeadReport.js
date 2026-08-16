import { GetLlmModel } from "../../llm/model.js";
import { HumanMessage, SystemMessage }
from "@langchain/core/messages";

import {
  LEAD_REPORT_PROMPT
} from "../../prompt/leadReport.prompt.js";

export const generateLeadReport =
async (memory) => {

  const llm =
    GetLlmModel("gemini");

  const result =
    await llm.invoke([

      new SystemMessage(
        LEAD_REPORT_PROMPT
      ),

      new HumanMessage(`
Lead Score:
${memory.leadScore}

Stage:
${memory.stage}

Facts:
${JSON.stringify(memory.facts)}

Summary:
${memory.summary}

`)
    ]);

  return result.content;
};