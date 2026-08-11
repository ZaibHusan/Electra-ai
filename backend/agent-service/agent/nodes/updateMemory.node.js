import CustomerMemory from "../../memory/models/customer.memory.js";

export const updateMemoryNode =
async (state) => {

  const memory =
  await CustomerMemory.findOne({
    customerId:
    state.customerId,
  });

  if (!memory)
    return state;

  // Update stage
  memory.stage =
    state.router.stage;

  // Update lead score
  memory.leadScore +=
    state.router.leadScoreDelta;

  // Merge facts
  memory.facts = {
    ...memory.facts,
    ...state.router.facts,
  };

  // Save customer message
  memory.lastMessages.push({
    role: "user",
    content: state.message,
  });

  // Save AI reply
  memory.lastMessages.push({
    role: "assistant",
    content: state.response,
  });

  // Keep only latest 20 messages
  if (
    memory.lastMessages.length > 20
  ) {
    memory.lastMessages =
      memory.lastMessages.slice(-20);
  }

  await memory.save();

  return state;
};