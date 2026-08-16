import PromptConfig from '../memory/models/prompt.model.js';

const loadPromptConfig = async () => {
    try {
        const promptConfig = await PromptConfig.findOne({ isActive: true })
            .sort({ updatedAt: -1 })
            .lean();

        if (!promptConfig) {
            console.warn('[PromptLoader] No active config found, using defaults');
            return {
                systemPrompt: "You are Electra, an AI sales assistant.",
                dos: [],
                donts: [],
                temperature: 0.7,
                maxTokens: 1000,
                modelName: 'gemini-1.5-pro'
            };
        }

        return promptConfig;
    } catch (error) {
        console.error('[PromptLoader] Error:', error.message);
        return {
            systemPrompt: "You are Electra, an AI sales assistant.",
            dos: [],
            donts: [],
            temperature: 0.7,
            maxTokens: 1000,
            modelName: 'gemini-1.5-pro'
        };
    }
};

export default loadPromptConfig;