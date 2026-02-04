import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    const { user } = useAuth();

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

    const handleNewsletterSignup = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }
        setSubscribing(true);
        // Simulated newsletter signup
        setTimeout(() => {
            toast.success('Welcome to our newsletter! ✨');
            setEmail('');
            setSubscribing(false);
        }, 1000);
    };

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const heroVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen space-y-6">
                <Loader2 size={48} className="text-gold-400 animate-spin" />
                <p className="text-charcoal-500 font-medium">Discovering stories...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bone dark:bg-charcoal-900">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[60vh] flex items-center justify-center">
                <div className="absolute inset-0 bg-gold-50/30 -z-10"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        variants={heroVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-8"
                    >
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-secondary dark:text-bone-100 tracking-tight leading-none">
                            Ahlan, welcome to <span className="text-primary italic">miniBlog</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-charcoal-500 dark:text-bone-300 max-w-2xl mx-auto font-light leading-relaxed">
                            A curated space for thoughtful storytelling and meaningful connection.
                        </p>

                        <div className="pt-8">
                            <Link
                                to={user ? '/dashboard' : '/posts'}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-lg font-medium rounded-full hover:bg-gold-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                            >
                                Start Exploring
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Post Section - Editorial Highlight */}
            {posts.length > 0 && (
                <section className="px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 border-b border-charcoal-200 dark:border-charcoal-700 pb-4">
                            <h2 className="font-serif text-sm uppercase tracking-widest text-charcoal-500 dark:text-bone-400">Editorial Highlight</h2>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                        >
                            {/* Image Side */}
                            <div className="lg:col-span-8 relative overflow-hidden rounded-lg aspect-[16/9] lg:aspect-[21/9]">
                                <Link to={`/posts/${posts[0]._id}`}>
                                    {posts[0].coverImage ? (
                                        <img
                                            src={`http://localhost:5000${posts[0].coverImage}`}
                                            alt={posts[0].title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-bone-200 dark:bg-charcoal-700"></div>
                                    )}
                                </Link>
                            </div>

                            {/* Content Side */}
                            <div className="lg:col-span-4 lg:pl-8">
                                <Link to={`/posts/${posts[0]._id}`}>
                                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-secondary dark:text-bone-100 mb-6 leading-tight group-hover:text-primary transition-colors">
                                        {posts[0].title}
                                    </h2>
                                </Link>
                                <p className="text-charcoal-600 dark:text-bone-300 text-lg mb-6 line-clamp-3 font-light">
                                    {posts[0].description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-charcoal-400 dark:text-bone-400 uppercase tracking-wide font-medium">
                                    <span>{posts[0].author.username}</span>
                                    <span>•</span>
                                    <span>{posts[0].readTime} min read</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Slow Brew Newsletter - Lead Magnet */}
            <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-charcoal-800 border-y border-bone-200 dark:border-charcoal-700">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="font-serif text-4xl md:text-5xl text-secondary dark:text-bone-100 italic">
                                Slow Brew
                            </h2>
                            <p className="text-charcoal-500 dark:text-bone-300 text-lg font-light max-w-lg mx-auto">
                                A weekly pour of inspiration, creative insights, and intentional living. Delivered every Sunday.
                            </p>
                        </div>

                        <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="flex-1 bg-transparent border-b border-charcoal-300 dark:border-charcoal-500 py-3 px-2 text-secondary dark:text-bone-100 placeholder-charcoal-400 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={subscribing}
                                className="bg-secondary dark:bg-bone-100 text-white dark:text-charcoal-900 px-8 py-3 rounded-full hover:bg-primary dark:hover:bg-primary transition-colors duration-300 font-medium"
                            >
                                {subscribing ? <Loader2 className="animate-spin" /> : 'Subscribe'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Posts Grid Section */}
            {posts.length > 1 && (
                <section className="px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-end justify-between mb-12">
                            <h2 className="font-serif text-3xl font-bold text-secondary dark:text-bone-100">
                                Latest Stories
                            </h2>
                            <Link to="/posts" className="text-primary hover:text-gold-600 font-medium text-sm uppercase tracking-wide">
                                View All
                            </Link>
                        </div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid gap-10 md:grid-cols-2" // 2-Column Layout
                        >
                            {posts.slice(1).map(post => (
                                <motion.div key={post._id} variants={item}>
                                    <PostCard post={post} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Call to Action Section */}
            {!user && (
                <section className="px-4 sm:px-6 lg:px-8 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-bone-100 mb-6">
                            Ready to share your story?
                        </h2>
                        <p className="text-charcoal-600 dark:text-bone-300 text-lg mb-8">
                            Join our community of thoughtful creators and share your unique perspective with the world.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-400 hover:bg-gold-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Create Account
                                <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-4 bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-bone-100 font-semibold rounded-lg hover:bg-charcoal-200 dark:hover:bg-charcoal-700 transition-all duration-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Bottom Spacing */}
            <div className="h-20"></div>
        </div>
    );
};

export default Home;
