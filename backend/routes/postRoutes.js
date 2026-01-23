import express from 'express';
import {
    getAllPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    commentOnPost
} from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', protect, createPost);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);

export default router;
