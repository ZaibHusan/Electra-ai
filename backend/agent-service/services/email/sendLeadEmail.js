import { transporter }
  from "./transporter.js";
import {
  generateLeadReport
}
  from "../handoff/generateLeadReport.js";

export const sendLeadEmail =
  async (memory) => {

    const report =
      await generateLeadReport(
        memory
      );

    await transporter.sendMail({

      from:
        process.env.EMAIL_USER,

      to:
        process.env.EMAIL_USER,

      subject:
        `🔥 HOT LEAD | ${memory.facts?.name ||
        "Unknown"
        } | Score ${memory.leadScore
        }`,

      html: `

  <div
    style="
      font-family:Arial;
      max-width:800px;
    "
  >

    <h1>
      🔥 New Hot Lead
    </h1>

    <hr>

    <h2>
      AI Lead Analysis
    </h2>

    <div
      style="
      background:#f5f5f5;
      padding:15px;
      border-radius:8px;
      white-space:pre-wrap;
      "
    >
      ${report}
    </div>

    <hr>

    <h2>
      Customer Details
    </h2>

    <p>
      <strong>ID:</strong>
      ${memory.customerId}
    </p>

    <p>
      <strong>Name:</strong>
      ${memory.facts?.name || "Unknown"}
    </p>

    <p>
      <strong>City:</strong>
      ${memory.facts?.city || "Unknown"}
    </p>

    <p>
      <strong>Budget:</strong>
      ${memory.facts?.budget || "Unknown"}
    </p>

    <p>
      <strong>Product:</strong>
      ${memory.facts?.product || "Unknown"}
    </p>

    <p>
      <strong>Lead Score:</strong>
      ${memory.leadScore}
    </p>

    <p>
      <strong>Stage:</strong>
      ${memory.stage}
    </p>

    <hr>

    <h2>
      Recent Conversation
    </h2>

    ${memory.lastMessages
          .slice(-10)
          .map(
            msg => `
          <p>
            <b>${msg.role}</b>:
            ${msg.content}
          </p>
        `
          )
          .join("")
        }

  </div>
`
    });

  };