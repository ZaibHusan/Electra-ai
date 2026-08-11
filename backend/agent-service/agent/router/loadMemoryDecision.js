// router/loadMemoryDecision.js

export const loadMemoryDecision =
(state) => {

  if (
    state.handoff === true
  ) {
    return "end";
  }

  return "continue";
};