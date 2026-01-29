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
            <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-majorelle-400/5 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        variants={heroVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-6 mb-12"
                    >
                        <div>
                            <p className="text-sm uppercase tracking-widest text-gold-500 font-semibold mb-4">
                                Welcome to your creative space
                            </p>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-charcoal-900 dark:text-bone-100 leading-tight mb-6">
                                {user ? (
                                    <>
                                        Hey <span className="text-gold-400">{user.username}</span>,
                                        <br />
                                        <span className="text-charcoal-700 dark:text-bone-300">Let's create something beautiful</span>
                                    </>
                                ) : (
                                    <>
                                        Slow Down<span className="text-gold-400">.</span>
                                        <br />
                                        <span className="text-charcoal-700 dark:text-bone-300">Simplify. Find What Feels Good</span>
                                    </>
                                )}
                            </h1>
                        </div>

                        <p className="text-lg sm:text-xl text-charcoal-600 dark:text-bone-300 max-w-2xl mx-auto leading-relaxed font-light">
                            {user
                                ? "Share your stories and inspire a community of thoughtful readers."
                                : "Discover intentional stories about productivity, creativity, and living well."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link
                                to={user ? '/dashboard' : '/register'}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-400 hover:bg-gold-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                {user ? 'Go to Dashboard' : 'Start Reading'}
                                <ArrowRight size={20} />
                            </Link>
                            {!user && (
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-charcoal-300 dark:border-bone-300 text-charcoal-900 dark:text-bone-100 font-semibold rounded-lg hover:bg-charcoal-50 dark:hover:bg-charcoal-800 transition-all duration-300"
                                >
                                    Start Writing
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Post Section */}
            {posts.length > 0 && (
                <section className="px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="overflow-hidden rounded-2xl bg-white dark:bg-charcoal-800 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
                                {/* Featured Image */}
                                {posts[0].coverImage && (
                                    <Link to={`/posts/${posts[0]._id}`} className="block overflow-hidden h-96 md:h-auto">
                                        <img
                                            src={`http://localhost:5000${posts[0].coverImage}`}
                                            alt={posts[0].title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                )}

                                {/* Featured Content */}
                                <div className="p-8 md:p-12 flex flex-col justify-between">
                                    <div>
                                        <p className="text-sm uppercase tracking-widest text-gold-500 font-semibold mb-4">Featured Story</p>
                                        <Link to={`/posts/${posts[0]._id}`}>
                                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-bone-100 mb-4 leading-tight hover:text-gold-400 transition-colors">
                                                {posts[0].title}
                                            </h2>
                                        </Link>
                                        {posts[0].description && (
                                            <p className="text-charcoal-600 dark:text-bone-300 text-lg leading-relaxed mb-6">
                                                {posts[0].description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-charcoal-200 dark:border-charcoal-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-400 to-terracotta-500 flex items-center justify-center text-white font-bold uppercase text-sm">
                                                {posts[0].author.username?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-charcoal-900 dark:text-bone-100">
                                                    {posts[0].author.username}
                                                </p>
                                                <p className="text-sm text-charcoal-500 dark:text-bone-400">
                                                    {posts[0].readTime} min read
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/posts/${posts[0]._id}`}
                                            className="text-gold-400 hover:text-gold-500 font-semibold flex items-center gap-2 transition-colors"
                                        >
                                            Read More
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Newsletter Signup Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-gradient-to-br from-gold-50 to-bone via-majorelle-50/20 dark:from-charcoal-800 dark:to-charcoal-900 dark:via-charcoal-800 rounded-3xl p-12 shadow-lg border border-gold-200 dark:border-charcoal-700">
                        <div className="text-center mb-8">
                            <h2 className="font-serif text-4xl font-bold text-charcoal-900 dark:text-bone-100 mb-3">
                                Slow Brew Sunday
                            </h2>
                            <p className="text-charcoal-600 dark:text-bone-300 text-lg">
                                Get weekly intentional stories and creative inspiration directly to your inbox.
                            </p>
                        </div>

                        <form onSubmit={handleNewsletterSignup} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-6 py-4 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-bone-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={subscribing}
                                className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {subscribing ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Subscribing...
                                    </>
                                ) : (
                                    <>
                                        Subscribe Now
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-charcoal-500 dark:text-bone-400 mt-6">
                            We respect your inbox. Unsubscribe anytime.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Posts Grid Section */}
            {posts.length > 0 && (
                <section className="px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-16"
                        >
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-bone-100 mb-3">
                                Latest Stories
                            </h2>
                            <p className="text-charcoal-600 dark:text-bone-300 text-lg">
                                Discover more thoughtful reads from our community
                            </p>
                        </motion.div>

                        {error ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/20"
                            >
                                <p className="text-lg text-red-600 dark:text-red-400 font-medium">{error}</p>
                            </motion.div>
                        ) : posts.length <= 1 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16 bg-bone-100 dark:bg-charcoal-800 rounded-2xl border-2 border-dashed border-charcoal-300 dark:border-charcoal-700"
                            >
                                <p className="text-xl font-serif font-bold text-charcoal-800 dark:text-bone-200 mb-2">
                                    Only one story so far
                                </p>
                                <p className="text-charcoal-600 dark:text-bone-400 mb-6">
                                    More wonderful stories coming soon...
                                </p>
                                <Link
                                    to={user ? '/create-post' : '/register'}
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-gold-400 hover:bg-gold-500 text-white font-semibold rounded-lg transition-all"
                                >
                                    {user ? 'Write a Story' : 'Join & Create'}
                                    <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {posts.slice(1).map(post => (
                                    <motion.div key={post._id} variants={item}>
                                        <PostCard post={post} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
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
