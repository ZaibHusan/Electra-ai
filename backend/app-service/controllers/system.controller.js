import SystemSettings from '../models/systemSettings.model.js';

async function getSettingsDoc() {
    let settings = await SystemSettings.findOne({ key: 'AI_SYSTEM_STATE' });
    if (!settings) {
        settings = await SystemSettings.create({ key: 'AI_SYSTEM_STATE', isActive: true });
    }
    return settings;
}

export const getStatus = async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        res.status(200).json({
            success: true,
            isActive: settings.isActive,
            updatedAt: settings.updatedAt
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const toggleStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ 
                success: false, 
                error: "Invalid payload. 'isActive' must be a boolean value." 
            });
        }

        const settings = await getSettingsDoc();
        settings.isActive = isActive;
        await settings.save();

        res.status(200).json({
            success: true,
            message: `AI system has been successfully ${settings.isActive ? 'ACTIVATED' : 'DISABLED'}.`,
            isActive: settings.isActive,
            updatedAt: settings.updatedAt
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};