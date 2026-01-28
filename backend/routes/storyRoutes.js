import express from 'express';
import {
    createStory,
    getAllStories,
    getStoryById,
    getUserStories,
    updateStory,
    deleteStory,
    likeStory
} from '../controllers/storyController.js';
import { protect } from '../middlewares/authMiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Protected routes (define before :id routes to avoid conflicts)
router.get('/user/stories', protect, getUserStories);
router.post('/', protect, uploadMiddleware.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'files', maxCount: 5 }
]), createStory);

// Public routes
router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.put('/:id', protect, uploadMiddleware.fields([
    { name: 'coverImage', maxCount: 1 }
]), updateStory);
router.delete('/:id', protect, deleteStory);
router.post('/:id/like', protect, likeStory);

export default router;
