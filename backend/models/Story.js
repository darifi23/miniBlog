import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverImage: {
        type: String,
        default: null
    },
    tags: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    readTime: {
        type: Number,
        default: 1
    },
    views: {
        type: Number,
        default: 0
    },
    published: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);
export default Story;
