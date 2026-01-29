import { Link } from 'react-router-dom';
import { Heart, MessageCircle, ArrowRight, Eye, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
    const formatDate = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return postDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group flex flex-col h-full bg-white dark:bg-charcoal-800/50 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 border border-bone-200 dark:border-charcoal-700/50"
        >
            {/* Cover Image */}
            {post.coverImage && (
                <Link to={`/posts/${post._id}`} className="block overflow-hidden h-48">
                    <img
                        src={`http://localhost:5000${post.coverImage}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>
            )}

            <div className="p-4 md:p-6 flex flex-col h-full">
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold-400 to-terracotta-500 flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
                        {post.author.username?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-charcoal-900 dark:text-bone-100 truncate">{post.author.username}</p>
                        <p className="text-xs text-charcoal-500 dark:text-bone-400">{formatDate(post.createdAt)}</p>
                    </div>
                </div>

                {/* Title & Description */}
                <Link to={`/posts/${post._id}`} className="flex-1">
                    <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-charcoal-900 dark:text-bone-100 mb-2 leading-tight group-hover:text-gold-400 dark:group-hover:text-gold-300 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        {post.description && (
                            <p className="text-sm md:text-base text-charcoal-600 dark:text-bone-300 line-clamp-2 leading-relaxed mb-3">
                                {post.description}
                            </p>
                        )}
                    </div>
                </Link>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300 rounded-full text-xs font-semibold"
                            >
                                <Tag size={12} />
                                {tag}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="text-xs text-charcoal-500 dark:text-bone-400 self-center">+{post.tags.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Stats & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-bone-200 dark:border-charcoal-700/50 mt-auto">
                    <div className="flex items-center gap-4 text-xs md:text-sm text-charcoal-500 dark:text-bone-400">
                        {post.readTime && (
                            <span className="flex items-center gap-1 whitespace-nowrap">
                                📖 {post.readTime} min
                            </span>
                        )}
                        {post.views !== undefined && (
                            <span className="flex items-center gap-1 whitespace-nowrap">
                                <Eye size={14} />
                                {post.views}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-3 text-charcoal-500 dark:text-bone-400">
                        <div className="flex items-center space-x-1 hover:text-terracotta-500 dark:hover:text-terracotta-400 transition-colors cursor-pointer">
                            <Heart size={16} className={post.likes && post.likes.length > 0 ? "fill-terracotta-500 text-terracotta-500" : ""} />
                            <span className="text-xs md:text-sm font-medium">{post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-gold-600 dark:hover:text-gold-400 transition-colors cursor-pointer">
                            <MessageCircle size={16} />
                            <span className="text-xs md:text-sm font-medium">{post.comments?.length || 0}</span>
                        </div>
                        <Link to={`/posts/${post._id}`} className="text-charcoal-400 dark:text-bone-600 group-hover:text-gold-400 dark:group-hover:text-gold-300 transition-all transform group-hover:translate-x-1">
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;