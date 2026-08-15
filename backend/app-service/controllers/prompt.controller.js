import PromptConfig from '../models/PromptConfig.js';

/**
 * 1. GET: Fetch the current active AI configuration for the Admin Dashboard
 */
export const getPromptConfig = async (req, res) => {
    try {
        let config = await PromptConfig.findOne({ isActive: true });
        
        // Fallback default if no configuration exists in the database yet
        if (!config) {
            config = await PromptConfig.create({
                configName: 'Production AI Config',
                systemPrompt: 'You are Electra, an elite AI Sales Expert and Operations Assistant for the Electra CRM platform.',
                dos: ['Always be truthful to knowledge', 'Personalize responses using user memory'],
                donts: ['Do not hallucinate facts', 'Do not make unauthorized promises or price discounts'],
                temperature: 0.7,
                maxTokens: 1000,
                modelName: 'gemini-1.5-pro'
            });
        }
        
        res.status(200).json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * 2. PUT/POST: Update or create the AI prompt configuration from the Admin Dashboard
 */
export const updatePromptConfig = async (req, res) => {
    try {
        const { systemPrompt, dos, donts, temperature, maxTokens, modelName, configName } = req.body;

        const updatedConfig = await PromptConfig.findOneAndUpdate(
            { isActive: true },
            { 
                configName: configName || 'Production AI Config',
                systemPrompt, 
                dos, 
                donts, 
                temperature, 
                maxTokens, 
                modelName,
                updatedBy: req.user?.name || 'Admin' 
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ 
            success: true, 
            message: 'AI prompt configuration updated successfully', 
            data: updatedConfig 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};