import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Send, Share2, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const { user } = useAuth();
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/posts/${id}`);
                setPost(res.data);
                setLikeCount(res.data.likes.length);
                if (user && res.data.likes.includes(user._id)) {
                    setIsLiked(true);
                }
            } catch (error) {
                console.error(error);
                toast.error('Story not found');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, user]);

    const handleLike = async () => {
        if (!user) {
            toast.error('Please login to like');
            return;
        }
        try {
            const res = await api.put(`/posts/${id}/like`);
            setLikeCount(res.data.length);
            setIsLiked(res.data.includes(user._id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const res = await api.post(`/posts/${id}/comment`, { text: comment });
            setPost({ ...post, comments: res.data });
            setComment('');
            toast.success('Response added');
        } catch (error) {
            toast.error('Failed to add response');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = post?.title || 'Check out this story';
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: post?.description || '',
                    url: url
                });
                toast.success('Shared successfully!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    toast.error('Failed to share');
                }
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
                setShowShare(false);
            } catch (error) {
                toast.error('Failed to copy link');
            }
        }
    };

    const handleMenuAction = (action) => {
        switch(action) {
            case 'report':
                toast.info('Story reported');
                break;
            case 'bookmark':
                toast.success('Story bookmarked');
                break;
            case 'subscribe':
                toast.success('Subscribed to author');
                break;
            default:
                break;
        }
        setShowMenu(false);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );
    if (!post) return (
        <div className="text-center py-20 px-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Post not found</h2>
            <Link to="/" className="text-primary-600 font-bold hover:underline">&larr; Back to home</Link>
        </div>
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:pt-24">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-10 transition-colors font-medium"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <article className="mb-20">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-slate-100 dark:border-slate-800 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg uppercase shadow-lg shadow-primary-500/20">
                                {post.author.username?.[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{post.author.username}</h4>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span>{formatDate(post.createdAt)}</span>
                                    <span>·</span>
                                    <span>6 min read</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 relative">
                            <button 
                                onClick={() => setShowShare(!showShare)}
                                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors hover:text-slate-900 dark:hover:text-white"
                                title="Share story"
                            >
                                <Share2 size={20} />
                            </button>
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors hover:text-slate-900 dark:hover:text-white"
                                title="More options"
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            {/* Share Dropdown */}
                            {showShare && (
                                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 p-3 min-w-max">
                                    <button
                                        onClick={handleShare}
                                        className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors flex items-center gap-2"
                                    >
                                        <Share2 size={16} />
                                        Share or Copy Link
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post?.title}`, '_blank');
                                            setShowShare(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                    >
                                        Share on Twitter
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
                                            setShowShare(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                    >
                                        Share on Facebook
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank');
                                            setShowShare(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                    >
                                        Share on LinkedIn
                                    </button>
                                    <button
                                        onClick={() => setShowShare(false)}
                                        className="w-full text-left px-4 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors border-t border-slate-200 dark:border-slate-700 mt-2 pt-2 text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}

                            {/* Menu Dropdown */}
                            {showMenu && (
                                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 p-3 min-w-max">
                                    <button
                                        onClick={() => handleMenuAction('bookmark')}
                                        className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                    >
                                        Bookmark
                                    </button>
                                    <button
                                        onClick={() => handleMenuAction('subscribe')}
                                        className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                    >
                                        Subscribe to Author
                                    </button>
                                    <button
                                        onClick={() => handleMenuAction('report')}
                                        className="w-full text-left px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors border-t border-slate-200 dark:border-slate-700 mt-2 pt-2"
                                    >
                                        Report Story
                                    </button>
                                    <button
                                        onClick={() => setShowMenu(false)}
                                        className="w-full text-left px-4 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors border-t border-slate-200 dark:border-slate-700 mt-2 pt-2 text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="prose prose-xl prose-slate dark:prose-invert max-w-none">
                    {post.content.split('\n').map((para, i) => (
                        <p key={i} className="mb-8 text-slate-700 dark:text-slate-300 md:text-xl leading-relaxed">
                            {para}
                        </p>
                    ))}
                </div>

                <footer className="mt-16 flex items-center gap-8 border-b border-slate-100 dark:border-slate-800 pb-12">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 transition-all group ${isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <Heart size={24} className={isLiked ? "fill-rose-600" : "group-hover:scale-110 transition-transform"} />
                        <span className="font-bold">{likeCount}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all group">
                        <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="font-bold">{post.comments.length}</span>
                    </button>
                </footer>
            </article>

            <section id="comments" className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Responses ({post.comments.length})</h3>

                {user ? (
                    <form onSubmit={handleComment} className="mb-12">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-800">
                            <textarea
                                className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                rows="3"
                                placeholder="What are your thoughts?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="bg-primary-600 text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                                    disabled={!comment.trim()}
                                >
                                    Publish
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl text-center mb-12">
                        <p className="text-slate-500 mb-4 font-medium">Want to join the conversation?</p>
                        <Link to="/login" className="text-primary-600 font-bold hover:underline">Log in to leave a response</Link>
                    </div>
                )}

                <div className="space-y-10">
                    {post.comments.map((comment, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold uppercase shrink-0">
                                {comment.user.username?.[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-slate-900 dark:text-white">{comment.user.username}</span>
                                    <span className="text-slate-400 text-sm">·</span>
                                    <span className="text-sm text-slate-500">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PostDetails;
