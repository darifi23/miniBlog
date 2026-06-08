import Post from '../models/Post.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary from env (ensure CLOUDINARY_* variables are set)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer, folder = 'miniBlog') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a post
export const createPost = async (req, res) => {
    try {
        if (!req.body.title || !req.body.content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Calculate read time (average 200 words per minute)
        const wordCount = req.body.content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);

        const postData = {
            title: req.body.title,
            content: req.body.content,
            description: req.body.description || '',
            author: req.user._id,
            tags: req.body.tags || [],
            readTime: readTime
        };

        // Add cover image if uploaded (upload to Cloudinary)
        if (req.files && req.files.coverImage && req.files.coverImage[0]) {
            try {
                const file = req.files.coverImage[0];
                const result = await uploadBufferToCloudinary(file.buffer, 'miniBlog/cover');
                postData.coverImage = result.secure_url;
            } catch (err) {
                console.error('Cloudinary cover upload error:', err);
            }
        }

        // Add other files if uploaded (upload each to Cloudinary)
        if (req.files && req.files.files && req.files.files.length) {
            const uploadedFiles = [];
            for (const file of req.files.files) {
                try {
                    const result = await uploadBufferToCloudinary(file.buffer, 'miniBlog/files');
                    uploadedFiles.push({
                        filename: file.originalname,
                        url: result.secure_url,
                        fileType: file.mimetype,
                        size: file.size
                    });
                } catch (err) {
                    console.error('Cloudinary file upload error:', err);
                }
            }
            if (uploadedFiles.length) postData.files = uploadedFiles;
        }

        const post = await Post.create(postData);
        const populatedPost = await Post.findById(post._id).populate('author', 'username email');

        res.status(201).json(populatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get single post
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email')
            .populate('comments.user', 'username');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update post
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the post author
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).populate('author', 'username email');

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await post.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Like/Unlike Post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if post has already been liked
        if (post.likes.includes(req.user.id)) {
            // Unlike
             const index = post.likes.indexOf(req.user.id);
             post.likes.splice(index, 1);
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await post.save();
        res.status(200).json(post.likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add Comment
export const commentOnPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            text: req.body.text,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        const updatedPost = await Post.findById(req.params.id)
            .populate('author', 'username email')
            .populate('comments.user', 'username');

        res.status(200).json(updatedPost.comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
