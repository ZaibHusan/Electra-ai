import SystemSettings from "../../memory/models/systemSettings.model.js";

export const checkSystemNode = async (state) => {
    try {
        const settings = await SystemSettings.findOne({ key: 'AI_SYSTEM_STATE' });
        const isActive = settings ? settings.isActive : true;

        if (!isActive) {
            return {
                ...state,
                isAiActive: false,
                response: null,
                totalTokens: 0,
            };
        }

        return {
            ...state,
            isAiActive: true
        };
    } catch (error) {
        console.error("Error reading system status from DB:", error.message);
        return {
            ...state,
            isAiActive: true
        };
    }
};