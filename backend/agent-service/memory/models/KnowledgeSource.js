import mongoose from 'mongoose';

const knowledgeSourceSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    type: { 
        type: String, 
        enum: ['text', 'pdf'], 
        required: true 
    },
    content: { 
        type: String 
    }, // Populated if type is 'text'
    filePath: { 
        type: String 
    }, // Populated if type is 'pdf'
    updatedBy: { 
        type: String, 
        default: 'Admin',
        trim: true 
    }
}, { 
    timestamps: true,
    versionKey: false 
});

const KnowledgeSource = mongoose.model('KnowledgeSource', knowledgeSourceSchema, 'knowledgesources');

export default KnowledgeSource;