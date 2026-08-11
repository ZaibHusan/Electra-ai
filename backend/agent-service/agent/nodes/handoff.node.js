import {
  handoffLead
}
from "../../services/handoff/handoff.service.js";

export const handoffNode =
async (state) => {

  if (
    state.router.needHandoff
  ) {

    await handoffLead(
      state.customerId
    );

    return {
      ...state,
      handoff: true,
      response: null,
    };
  }

  return {
    ...state,
    handoff: false,
  };
};