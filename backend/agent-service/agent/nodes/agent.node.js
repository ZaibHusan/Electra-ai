import { GetLlmModel } from "../../llm/model.js"
import { SystemMessage } from "@langchain/core/messages";
import { SYSTEM_PROMPT } from "../../prompt/agent.prompt.js";

export const agentNode = async (state) => {
    try {
        const llm = GetLlmModel("gemini");

        const response = await llm.invoke([
            new SystemMessage(SYSTEM_PROMPT),
            ...state.messages
        ])

        return {
            messages: [
                response
            ]
        }
    } catch (error) {
        console.error(
            "Agent Node Error:",
            error
        );

        throw error;
    }
}