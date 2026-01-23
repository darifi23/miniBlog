import { useState, useEffect } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts');
                setPosts(res.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load stories. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
                <Loader2 size={48} className="text-primary-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Fetching latest stories...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-24 pb-20">
            {/* Hero Section */}
            <section className="px-4 sm:px-6 lg:px-8 mb-20">
                <div className="max-w-5xl mx-auto border-b border-slate-200 dark:border-slate-800 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div className="max-w-2xl">
                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none">
                                Stay <span className="text-primary-600 italic">curious.</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                Discover stories, thinking, and expertise from writers on any topic.
                            </p>
                        </div>
                        <div>
                            <button className="bg-dark dark:bg-white text-white dark:text-dark px-8 py-3 rounded-full text-lg font-bold hover:opacity-90 transition-all shadow-xl">
                                Start Reading
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {error ? (
                    <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                        <p className="text-xl text-red-600 dark:text-red-400 font-medium">{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No posts found</p>
                        <p className="text-slate-500 dark:text-slate-400">Be the first writer to share a story!</p>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;
