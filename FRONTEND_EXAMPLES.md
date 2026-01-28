# 🎨 FRONTEND COMPONENT EXAMPLES

## How to Use Story CRUD in React Components

### Example 1: Create Story Component
```jsx
import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const CreateStory = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await api.post('/stories', {
                title,
                content,
                description,
                tags: tags.split(',').map(t => t.trim())
            });
            
            toast.success('Story created successfully! 🎉');
            // Reset form
            setTitle('');
            setContent('');
            setDescription('');
            setTags('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create story');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Story Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 border rounded"
            />
            <textarea
                placeholder="Story Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                className="w-full p-3 border rounded"
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded"
            />
            <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-3 border rounded"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
            >
                {isLoading ? 'Creating...' : 'Create Story'}
            </button>
        </form>
    );
};

export default CreateStory;
```

---

### Example 2: Story List Component
```jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import StoryCard from './StoryCard';
import { Loader2 } from 'lucide-react';

const StoryList = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await api.get('/stories');
            setStories(response.data);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => (
                <StoryCard key={story._id} story={story} />
            ))}
        </div>
    );
};

export default StoryList;
```

---

### Example 3: Story Detail Component
```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Heart, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const StoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [story, setStory] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStory();
    }, [id]);

    const fetchStory = async () => {
        try {
            const response = await api.get(`/stories/${id}`);
            setStory(response.data);
            setIsLiked(response.data.likes.includes(user?._id));
        } catch (error) {
            console.error('Failed to fetch story:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await api.post(`/stories/${id}/like`);
            setStory(response.data);
            setIsLiked(!isLiked);
        } catch (error) {
            toast.error('Failed to like story');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this story?')) return;
        
        try {
            await api.delete(`/stories/${id}`);
            toast.success('Story deleted successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to delete story');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!story) return <div>Story not found</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            {story.coverImage && (
                <img 
                    src={story.coverImage} 
                    alt={story.title}
                    className="w-full h-96 object-cover rounded-lg mb-8"
                />
            )}

            <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
            
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <div>
                    <p className="text-gray-600">By {story.author.username}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(story.createdAt).toLocaleDateString()} · 
                        {story.readTime} min read
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                    >
                        <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                        {story.likes.length}
                    </button>

                    {user?._id === story.author._id && (
                        <>
                            <button className="text-primary-600 hover:text-primary-700">
                                <Edit2 size={24} />
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 size={24} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="prose prose-lg">
                {story.content}
            </div>

            {story.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                    <div className="flex gap-2 flex-wrap">
                        {story.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 text-gray-500 text-sm">
                👁️ {story.views} views
            </div>
        </div>
    );
};

export default StoryDetail;
```

---

### Example 4: Update Story Component
```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const EditStory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchStory();
    }, [id]);

    const fetchStory = async () => {
        try {
            const response = await api.get(`/stories/${id}`);
            const story = response.data;
            setStory(story);
            setTitle(story.title);
            setContent(story.content);
            setDescription(story.description);
            setTags(story.tags.join(', '));
        } catch (error) {
            toast.error('Failed to fetch story');
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.put(`/stories/${id}`, {
                title,
                content,
                description,
                tags: tags.split(',').map(t => t.trim())
            });

            toast.success('Story updated successfully! 🎉');
            navigate(`/stories/${id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update story');
        } finally {
            setIsLoading(false);
        }
    };

    if (!story) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full p-3 border rounded"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded"
            />
            <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-3 border rounded"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
            >
                {isLoading ? 'Updating...' : 'Update Story'}
            </button>
        </form>
    );
};

export default EditStory;
```

---

### Example 5: User Dashboard (Stories List)
```jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trash2, Edit2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserStories();
    }, []);

    const fetchUserStories = async () => {
        try {
            const response = await api.get('/stories/user/stories');
            setStories(response.data);
        } catch (error) {
            toast.error('Failed to fetch your stories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this story?')) return;

        try {
            await api.delete(`/stories/${id}`);
            setStories(stories.filter(s => s._id !== id));
            toast.success('Story deleted');
        } catch (error) {
            toast.error('Failed to delete story');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">My Stories</h2>
            {stories.length === 0 ? (
                <p className="text-gray-500">You haven't created any stories yet.</p>
            ) : (
                <div className="space-y-4">
                    {stories.map(story => (
                        <div
                            key={story._id}
                            className="p-4 border rounded-lg flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold">{story.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {story.views} views · {story.likes.length} likes
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/stories/${story._id}`)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                >
                                    <Eye size={20} />
                                </button>
                                <button
                                    onClick={() => navigate(`/edit-story/${story._id}`)}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(story._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
```

---

## 📝 Summary

These examples show how to:
1. ✅ Create stories
2. ✅ List all stories
3. ✅ View story details
4. ✅ Like/unlike stories
5. ✅ Update stories
6. ✅ Delete stories
7. ✅ Manage user's stories from dashboard

You can copy these components and adapt them to your UI needs!
