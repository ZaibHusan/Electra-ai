import { loadMemory } from "../../memory/memory.service.js";
import { sendCustomerMessage } from "../../services/email/sendCustomerMessage.js";

export const loadMemoryNode = async (state) => {
    const memory = await loadMemory(state.customerId);

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
            handoff: true,
            response: null,
        };
    }

    return {
        ...state,
        memory,
        lastMessages: memory.lastMessages || [], // Available across all LangGraph nodes
    };
};