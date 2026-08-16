import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { GetLlmModel } from "../../llm/model.js";
import getTokens from "../../utils/getToken.js";

export const salesExpertNode = async (state) => {
    const promptConfig = state.promptConfig || {};

    const {
        systemPrompt = "You are Electra, an AI sales assistant.",
        dos = [],
        donts = [],
        temperature = 0.7,
        maxTokens = 1000,
        modelName = "gemini-3.1-flash-lite"
    } = promptConfig;

    // Build structured system prompt
    const buildSystemPrompt = () => {
        const sections = [systemPrompt];

        if (dos.length > 0) {
            sections.push(
                `\n=========================\nMANDATORY BEHAVIORS (DOs)\n=========================\n` +
                dos.map((d, i) => `${i + 1}. ${d}`).join('\n')
            );
        }

        if (donts.length > 0) {
            sections.push(
                `\n=========================\nSTRICT GUARDRAILS (DON'Ts)\n=========================\n` +
                donts.map((d, i) => `${i + 1}. ${d}`).join('\n')
            );
        }

        return sections.join('\n');
    };

    const fullSystemPrompt = buildSystemPrompt();

    // Build structured customer context
    const buildCustomerContext = () => {
        const context = [];

        context.push(`CUSTOMER MESSAGE:\n${state.message}`);

        if (state.memory && Object.keys(state.memory).length > 0) {
            context.push(`\nCUSTOMER MEMORY:\n${JSON.stringify(state.memory, null, 2)}`);
        }

        if (state.router) {
            const { stage, goal, leadScoreDelta, needHandoff } = state.router;
            context.push(`\nSALES ANALYSIS:`);
            context.push(`- Stage: ${stage || 'NEW'}`);
            context.push(`- Goal: ${goal || 'answer_question'}`);
            if (leadScoreDelta !== undefined) context.push(`- Lead Score Delta: ${leadScoreDelta}`);
            if (needHandoff !== undefined) context.push(`- Needs Handoff: ${needHandoff}`);
        }

        if (state.ragConfidence !== undefined && state.ragConfidence !== null) {
            context.push(`\nRAG CONFIDENCE: ${state.ragConfidence}`);
        }

        if (state.ragContext && state.ragContext.trim() !== '') {
            context.push(`\nKNOWLEDGE BASE (RAG):\n${state.ragContext}`);
        }

        return context.join('\n');
    };

    const customerContext = buildCustomerContext();

    console.log(`TEMP: ${temperature}, MAX_TOKENS: ${maxTokens}, MODEL: ${modelName}`);
    // Initialize LLM with dynamic config
    const llm = GetLlmModel("gemini", {
        temperature: Number(temperature),
        maxOutputTokens: Number(maxTokens),
        model: "gemini-3.1-flash-lite" // modelName || "gemini-1.5-pro"
    });

// Invoke with clean structure
const result = await llm.invoke([
    new SystemMessage(fullSystemPrompt),
    new HumanMessage(customerContext)
]);

return {
    ...state,
    response: result.content,
    totalTokens: (state.totalTokens || 0) + getTokens(result)
};
};