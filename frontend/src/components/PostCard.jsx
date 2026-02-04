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
            whileHover={{ y: -4 }}
            className="group flex flex-col h-full bg-transparent"
        >
            {/* Cover Image */}
            {post.coverImage && (
                <Link to={`/posts/${post._id}`} className="block overflow-hidden rounded-lg mb-4 aspect-[4/3] bg-bone-100">
                    <img
                        src={`http://localhost:5000${post.coverImage}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </Link>
            )}

            <div className="flex flex-col h-full">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-3 text-xs uppercase tracking-wider font-medium text-charcoal-500 dark:text-bone-400">
                    <span className="text-primary">{post.tags?.[0] || 'Story'}</span>
                    <span>•</span>
                    <span>{post.readTime || 5} min read</span>
                </div>

                {/* Title */}
                <Link to={`/posts/${post._id}`} className="block mb-3">
                    <h3 className="text-2xl font-serif font-bold text-secondary dark:text-bone-100 leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                </Link>

                {/* Description */}
                {post.description && (
                    <p className="text-charcoal-600 dark:text-bone-400 leading-relaxed line-clamp-2 mb-4 font-light text-sm">
                        {post.description}
                    </p>
                )}

                {/* Footer (Date & Save) */}
                <div className="mt-auto flex items-center justify-between border-t border-bone-200 dark:border-charcoal-700 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-bone-200 dark:bg-charcoal-600 flex items-center justify-center text-[10px] font-bold text-secondary">
                            {post.author.username?.[0]}
                        </div>
                        <span className="text-xs font-medium text-charcoal-500 dark:text-bone-400">{post.author.username}</span>
                    </div>
                    <span className="text-xs text-charcoal-400 dark:text-bone-500">{formatDate(post.createdAt)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;