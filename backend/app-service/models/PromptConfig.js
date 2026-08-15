import mongoose from 'mongoose';

const promptConfigSchema = new mongoose.Schema({
    configName: { type: String, required: true, default: 'Production AI Config' },
    isActive: { type: Boolean, default: true },
    
    // Core Persona & Instructions
    systemPrompt: { type: String, required: true },
    
    // Dynamic Rules Arrays (What to do / What not to do)
    dos: { type: [String], default: [] },
    donts: { type: [String], default: [] },

    // LLM Hyperparameters (Control AI style & cost)
    temperature: { type: Number, min: 0, max: 2, default: 0.7 },
    maxTokens: { type: Number, default: 1000 },
    modelName: { type: String, default: 'gemini-1.5-pro' },

    updatedBy: { type: String, default: 'Admin' }
}, { timestamps: true });

const PromptConfig = mongoose.model('PromptConfig', promptConfigSchema);

export default PromptConfig;