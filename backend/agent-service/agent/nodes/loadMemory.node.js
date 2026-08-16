import { loadMemory } from "../../memory/memory.service.js";
import { sendCustomerMessage } from "../../services/email/sendCustomerMessage.js";
import loadPromptConfig from "../../services/promptLoader.js";

export const loadMemoryNode = async (state) => {
    const memory = await loadMemory(state.customerId);
    const promptConfig = await loadPromptConfig();

    // If human agent handoff is active
    if (memory.leadStatus === "HANDED_OFF") {
        await sendCustomerMessage({
            customerId: state.customerId,
            message: state.message,
        });

        return {
            ...state,
            memory,
            lastMessages: memory.lastMessages || [],
            promptConfig,
            handoff: true,
            response: null,
        };
    }

    return {
        ...state,
        memory,
        lastMessages: memory.lastMessages || [],
        promptConfig
    };
};