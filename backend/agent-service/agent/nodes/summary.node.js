import { GetLlmModel } from "../../llm/model.js";
import CustomerMemory
from "../../memory/models/customer.memory.js";

import {
  SUMMARY_PROMPT
}
from "../../prompt/summary.prompt.js";

import {
  HumanMessage,
  SystemMessage
}
from "@langchain/core/messages";

export const summaryNode =
async (state) => {

  const memory =
  await CustomerMemory.findOne({
    customerId:
    state.customerId,
  });

  if (
    memory.lastMessages.length < 20
  ) {
    return state;
  }

  const llm =
  GetLlmModel("gemini");

  const summary =
  await llm.invoke([
    new SystemMessage(
      SUMMARY_PROMPT
    ),

    new HumanMessage(`
Current Summary:
${memory.summary}

Messages:
${JSON.stringify(
  memory.lastMessages
)}
`)
  ]);

  memory.summary =
    summary.content;

  // Keep only latest 10
  memory.lastMessages =
    memory.lastMessages.slice(-10);

  await memory.save();

  return state;
};