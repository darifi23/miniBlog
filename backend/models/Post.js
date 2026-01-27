import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const fileSchema = new mongoose.Schema({
    filename: String,
    url: String,
    fileType: String,
    size: Number,
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema({
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
    files: [fileSchema],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema],
    readTime: {
        type: Number,
        default: 1
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;
