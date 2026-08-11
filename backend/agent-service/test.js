import dotenv from "dotenv";
dotenv.config();

import {
  sendLeadEmail
}
from "./services/email/sendLeadEmail.js";

await sendLeadEmail({

  customerId: "2934",

  leadScore: 90,

  summary:
  "Customer ready to purchase",

  facts: {
    name: "Zaib",
    city: "Peshawar",
    product: "AirPods",
    budget: "15000"
  }

});