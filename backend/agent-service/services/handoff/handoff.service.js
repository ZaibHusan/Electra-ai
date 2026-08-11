import CustomerMemory
from "../../memory/models/customer.memory.js";

import {
  sendLeadEmail
}
from "../email/sendLeadEmail.js";

export const handoffLead =
async (customerId) => {

  const memory =
  await CustomerMemory.findOne({
    customerId,
  });

  if (!memory)
    return;

  if (
    memory.leadStatus ===
    "HANDED_OFF"
  ) {
    return;
  }

  await sendLeadEmail(memory);

  memory.leadStatus =
  "HANDED_OFF";

  await memory.save();

};