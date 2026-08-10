import { HumanMessage } from "@langchain/core/messages";
import { agentWorkflow } from "../agent/workflow.js";



export const agentController = async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required"
      });
    }

    const response = await agentWorkflow.invoke({
      messages: [
        new HumanMessage(prompt)
      ],
      userId
    }, {
      configurable: {
        thread_id: userId
      }
    })

    const lastMessage = response.messages[response.messages.length - 1];

    return res.status(200).json({
      success: true,
      message: lastMessage.content
    });
  }
  catch (error) {
    console.error("Error in agentController:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

