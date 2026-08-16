import mongoose from 'mongoose';

const promptConfigSchema = new mongoose.Schema({
    configName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    isActive: { 
        type: Boolean, 
        default: true,
        index: true 
    },
    systemPrompt: { 
        type: String, 
        required: true 
    },
    dos: [{ 
        type: String,
        trim: true 
    }],
    donts: [{ 
        type: String,
        trim: true 
    }],
    temperature: { 
        type: Number, 
        default: 0.7,
        min: 0,
        max: 2 
    },
    maxTokens: { 
        type: Number, 
        default: 1000,
        min: 1 
    },
    modelName: { 
        type: String, 
        default: 'gemini-1.5-pro',
        enum: ['gemini-1.5-pro', 'gemini-1.5-flash'] 
    },
    updatedBy: { 
        type: String, 
        default: 'Admin',
        trim: true 
    }
}, { 
    timestamps: true,
    versionKey: false 
});

const PromptConfig = mongoose.model('PromptConfig', promptConfigSchema, 'promptconfigs');

export default PromptConfig;