import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Trash2, Plus, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const res = await api.get('/posts');
                const myPosts = res.data.filter(post => post.author._id === user._id);
                setPosts(myPosts);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load your stories');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchMyPosts();
    }, [user]);

    const handleDelete = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await api.delete(`/posts/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
            toast.success('Story deleted');
        } catch (error) {
            toast.error('Failed to delete story');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-100 dark:border-slate-800 pb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Your Dashboard</h1>
                    <p className="text-slate-500 font-medium">Manage your stories and see how they're performing.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/create-post" className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-primary-500/20">
                        <Plus size={20} />
                        Write a Story
                    </Link>
                    <button className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 rounded-full transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <div className="grid gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Published ({posts.length})</h2>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-xl font-medium text-slate-500 mb-6">You haven't published any stories yet.</p>
                        <Link to="/create-post" className="text-primary-600 font-bold hover:underline">Start your first story &rarr;</Link>
                    </div>
                ) : (
                    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => (
                            <div key={post._id} className="relative group p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-primary-100 dark:hover:border-primary-900/30 transition-all shadow-sm hover:shadow-xl">
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="absolute top-4 right-4 p-2.5 bg-white dark:bg-slate-900 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 dark:hover:bg-red-900/40 z-10"
                                    title="Delete Post"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
