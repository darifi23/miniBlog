import Story from '../models/Story.js';

// CREATE - Create a new story
export const createStory = async (req, res) => {
    try {
        const { title, content, description, tags } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Calculate read time (average 200 words per minute)
        const wordCount = content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);

        const storyData = {
            title,
            content,
            description: description || '',
            author: req.user._id,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
            readTime
        };

        // Add cover image if provided
        if (req.files?.coverImage) {
            storyData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
        }

        const story = await Story.create(storyData);
        const populatedStory = await Story.findById(story._id).populate('author', 'username email');

        res.status(201).json(populatedStory);
    } catch (error) {
        console.error('Create story error:', error);
        res.status(500).json({ message: 'Server error creating story', error: error.message });
    }
};

// READ - Get all stories
export const getAllStories = async (req, res) => {
    try {
        const { published } = req.query;
        const filter = published !== undefined ? { published: published === 'true' } : {};

        const stories = await Story.find(filter)
            .populate('author', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(stories);
    } catch (error) {
        console.error('Get all stories error:', error);
        res.status(500).json({ message: 'Server error fetching stories' });
    }
};

// READ - Get single story by ID
export const getStoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const story = await Story.findById(id)
            .populate('author', 'username email')
            .populate('likes', 'username');

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Increment views
        story.views += 1;
        await story.save();

        res.status(200).json(story);
    } catch (error) {
        console.error('Get story error:', error);
        res.status(500).json({ message: 'Server error fetching story' });
    }
};

// READ - Get user's stories
export const getUserStories = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const stories = await Story.find({ author: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json(stories);
    } catch (error) {
        console.error('Get user stories error:', error);
        res.status(500).json({ message: 'Server error fetching user stories' });
    }
};

// UPDATE - Update a story
export const updateStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, description, tags, published } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find story
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Check authorization
        if (story.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this story' });
        }

        // Update fields
        if (title) story.title = title;
        if (content) {
            story.content = content;
            const wordCount = content.split(/\s+/).length;
            story.readTime = Math.ceil(wordCount / 200);
        }
        if (description !== undefined) story.description = description;
        if (tags) story.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
        if (published !== undefined) story.published = published;

        // Update cover image if provided
        if (req.files?.coverImage) {
            story.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
        }

        const updatedStory = await story.save();
        const populatedStory = await Story.findById(updatedStory._id).populate('author', 'username email');

        res.status(200).json(populatedStory);
    } catch (error) {
        console.error('Update story error:', error);
        res.status(500).json({ message: 'Server error updating story', error: error.message });
    }
};

// DELETE - Delete a story
export const deleteStory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find story
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Check authorization
        if (story.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this story' });
        }

        await Story.findByIdAndDelete(id);

        res.status(200).json({ message: 'Story deleted successfully', id });
    } catch (error) {
        console.error('Delete story error:', error);
        res.status(500).json({ message: 'Server error deleting story' });
    }
};

// LIKE - Like/Unlike a story
export const likeStory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const story = await Story.findById(id);

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        const userLiked = story.likes.includes(req.user._id);

        if (userLiked) {
            story.likes = story.likes.filter(like => like.toString() !== req.user._id.toString());
        } else {
            story.likes.push(req.user._id);
        }

        const updatedStory = await story.save();
        const populatedStory = await Story.findById(updatedStory._id).populate('likes', 'username');

        res.status(200).json(populatedStory);
    } catch (error) {
        console.error('Like story error:', error);
        res.status(500).json({ message: 'Server error liking story' });
    }
};
