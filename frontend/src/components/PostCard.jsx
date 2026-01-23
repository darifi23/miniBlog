import { Link } from 'react-router-dom';
import { Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group flex flex-col h-full"
        >
            <Link to={`/posts/${post._id}`} className="flex-1">
                <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                            {post.author.username?.[0]}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{post.author.username}</span>
                        <span className="text-slate-400 text-sm">·</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-3 text-base leading-relaxed mb-4">
                        {post.content}
                    </p>
                </div>
            </Link>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-5 text-slate-500">
                    <div className="flex items-center space-x-1 hover:text-accent-500 transition-colors cursor-pointer">
                        <Heart size={18} className={post.likes.length > 0 ? "fill-accent-500 text-accent-500" : ""} />
                        <span className="text-sm font-medium">{post.likes.length}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-primary-600 transition-colors cursor-pointer">
                        <MessageCircle size={18} />
                        <span className="text-sm font-medium">{post.comments.length}</span>
                    </div>
                </div>
                <Link to={`/posts/${post._id}`} className="text-slate-400 group-hover:text-primary-600 transition-all transform group-hover:translate-x-1">
                    <ArrowRight size={20} />
                </Link>
            </div>
        </motion.div>
    );
};

export default PostCard;
