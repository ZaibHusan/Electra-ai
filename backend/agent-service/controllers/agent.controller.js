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

    const result =
      await agentWorkflow.invoke(
        {
          customerId: userId,
          message: prompt
        },
        {
          configurable: {
            thread_id: userId
          }
        }
      );


    return res.status(200).json({
      success: true,
      message: result.response,
      totalTokens: result.totalTokens
    });
  }
  catch (error) {
    console.error("Error in agentController:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

