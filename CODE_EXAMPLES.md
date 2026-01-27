# Quick Code Examples - Medium-Style Blog Features

## 1. Enhanced Post Creation (Frontend)

```jsx
import { useState, useRef } from 'react';
import api from '../api/axios';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [attachedFiles, setAttachedFiles] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('content', content);
        formData.append('tags', tags.split(',').map(t => t.trim()));
        
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        attachedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Post created:', response.data);
        } catch (error) {
            console.error('Error:', error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Cover Image Input */}
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
            />

            {/* Title */}
            <input
                type="text"
                placeholder="Your story title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* Description */}
            <textarea
                placeholder="Short description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* Content */}
            <textarea
                placeholder="Write your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            {/* Tags */}
            <input
                type="text"
                placeholder="Add tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />

            {/* File Attachments */}
            <input
                type="file"
                multiple
                onChange={(e) => setAttachedFiles(Array.from(e.target.files))}
            />

            <button type="submit">Publish Post</button>
        </form>
    );
};
```

## 2. Enhanced Post Model (Backend)

```javascript
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    // Basic info
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, default: '' },
    
    // Author
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Media
    coverImage: { type: String, default: null },
    files: [{
        filename: String,
        url: String,
        fileType: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now }
    }],
    
    // Organization
    tags: [String],
    
    // Engagement
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    
    // Stats
    readTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
```

## 3. File Upload Middleware (Backend)

```javascript
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'video/mp4', 'audio/mpeg'
    ];
    
    cb(null, allowedMimes.includes(file.mimetype));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

export default upload;
```

## 4. Enhanced Post Controller (Backend)

```javascript
import Post from '../models/Post.js';

export const createPost = async (req, res) => {
    try {
        if (!req.body.title || !req.body.content) {
            return res.status(400).json({ message: 'Title and content required' });
        }

        // Calculate read time (200 words per minute)
        const wordCount = req.body.content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);

        const postData = {
            title: req.body.title,
            content: req.body.content,
            description: req.body.description || '',
            author: req.user._id,
            tags: req.body.tags || [],
            readTime
        };

        // Handle cover image
        if (req.files?.coverImage) {
            postData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
        }

        // Handle attached files
        if (req.files?.files) {
            postData.files = req.files.files.map(file => ({
                filename: file.originalname,
                url: `/uploads/${file.filename}`,
                fileType: file.mimetype,
                size: file.size
            }));
        }

        const post = await Post.create(postData);
        const populatedPost = await Post.findById(post._id)
            .populate('author', 'username email');

        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

## 5. Enhanced Post Card (Frontend)

```jsx
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Tag, Eye } from 'lucide-react';

const PostCard = ({ post }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
            {/* Cover Image */}
            {post.coverImage && (
                <img
                    src={`http://localhost:5000${post.coverImage}`}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform"
                />
            )}

            <div className="p-6">
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                        {post.author.username[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {post.author.username}
                        </p>
                        <p className="text-xs text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Title & Description */}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {post.title}
                </h2>
                {post.description && (
                    <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {post.description}
                    </p>
                )}

                {/* Tags */}
                {post.tags?.length > 0 && (
                    <div className="flex gap-2 mb-4">
                        {post.tags.slice(0, 3).map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold flex items-center gap-1"
                            >
                                <Tag size={12} />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-4 text-sm text-slate-500">
                        {post.readTime && <span>📖 {post.readTime} min</span>}
                        {post.views && (
                            <span className="flex items-center gap-1">
                                <Eye size={14} /> {post.views}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-4 text-slate-500">
                        <span className="flex items-center gap-1">
                            <Heart size={16} />
                            {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle size={16} />
                            {post.comments?.length || 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
```

## 6. Fixed Auth Middleware (Backend)

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next(); // ✅ Added return to prevent double response
        } catch (error) {
            return res.status(401).json({ message: 'Token failed' }); // ✅ Added return
        }
    }

    return res.status(401).json({ message: 'No token provided' }); // ✅ Added return
};
```

## 7. Post Routes with File Upload (Backend)

```javascript
import express from 'express';
import { createPost, getAllPosts } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// POST with file uploads
router.post(
    '/',
    protect,
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'files', maxCount: 10 }
    ]),
    createPost
);

router.get('/', getAllPosts);

export default router;
```

## 8. Read Time Calculator

```javascript
// Calculate read time based on content length
const calculateReadTime = (text) => {
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(wordCount / 200); // 200 words per minute average
};

// Example usage
const content = "Lorem ipsum dolor sit amet..."; // 1000 words
const readTime = calculateReadTime(content); // Returns 5 (5 minutes)
```

---

## Key Improvements Summary

✅ **Fixed Bugs:**
- Auth middleware double-response issue
- User ID consistency (id → _id)
- Missing login validation

✅ **New Features:**
- Medium-style post creation with description
- File upload system (10 files, 50MB limit)
- Cover image support
- Tags/categories system
- Automatic read time calculation
- Post preview mode
- Enhanced post cards with all metadata

✅ **Better UX:**
- Real-time word count
- Visual file previews
- Dark mode support
- Responsive design
- Toast notifications
- Smooth animations
