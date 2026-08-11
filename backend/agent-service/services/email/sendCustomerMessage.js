import { transporter }
from "./transporter.js";

export const sendCustomerMessage =
async ({
  customerId,
  message,
}) => {

  await transporter.sendMail({

    from:
    process.env.EMAIL_USER,

    to:
    process.env.EMAIL_USER,

    subject:
    `📩 Customer Reply - ${customerId}`,

    html: `
      <h3>New Customer Message</h3>

      <p>
        <b>Customer ID:</b>
        ${customerId}
      </p>

      <p>
        <b>Message:</b>
        ${message}
      </p>
    `,
  });

};