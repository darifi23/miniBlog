import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Send, X, Image as ImageIcon, Paperclip, Tag, Eye } from 'lucide-react';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const coverImageRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileAttach = (e) => {
        const files = Array.from(e.target.files || []);
        if (attachedFiles.length + files.length > 10) {
            toast.error('Maximum 10 files allowed');
            return;
        }
        setAttachedFiles([...attachedFiles, ...files]);
    };

    const removeAttachedFile = (index) => {
        setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
    };

    const removeCoverImage = () => {
        setCoverImage(null);
        setCoverImagePreview(null);
    };

    const calculateReadTime = (text) => {
        const wordCount = text.split(/\s+/).length;
        return Math.ceil(wordCount / 200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        if (!user) {
            toast.error('You must be logged in');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('content', content);
            formData.append('tags', tags ? tags.split(',').map(t => t.trim()) : []);
            
            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            attachedFiles.forEach((file) => {
                formData.append('files', file);
            });

            await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Story published successfully! 🚀');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to publish story');
        } finally {
            setIsLoading(false);
        }
    };

    const readTime = calculateReadTime(content);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            {showPreview ? (
                // Preview Mode
                <div className="min-h-screen p-6 md:p-12 lg:p-20">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="mb-6 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors"
                        >
                            ← Back to Edit
                        </button>

                        {coverImagePreview && (
                            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={coverImagePreview}
                                    alt="Cover"
                                    className="w-full h-96 object-cover"
                                />
                            </div>
                        )}

                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                            {title || 'Untitled Story'}
                        </h1>

                        {description && (
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                {description}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{user?.username}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{readTime} min read</p>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none mb-12">
                            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {content}
                            </p>
                        </div>

                        {tags && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {tags.split(',').map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold"
                                    >
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        {attachedFiles.length > 0 && (
                            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6 mb-8">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Attached Files ({attachedFiles.length})</h3>
                                <div className="space-y-2">
                                    {attachedFiles.map((file, i) => (
                                        <p key={i} className="text-sm text-slate-600 dark:text-slate-400">
                                            📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowPreview(false)}
                            className="w-full md:w-auto bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                        >
                            Continue Editing
                        </button>
                    </div>
                </div>
            ) : (
                // Edit Mode
                <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 lg:pt-16">
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Draft a Story
                        </h1>
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                type="button"
                                onClick={() => setShowPreview(true)}
                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                title="Preview"
                            >
                                <Eye size={24} />
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                title="Cancel"
                            >
                                <X size={24} />
                            </button>
                            <button
                                form="post-form"
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 md:px-6 py-2 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                                {isLoading ? 'Publishing...' : 'Publish'}
                            </button>
                        </div>
                    </div>

                    <form id="post-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Cover Image */}
                        <div className="relative">
                            {coverImagePreview ? (
                                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={coverImagePreview}
                                        alt="Cover Preview"
                                        className="w-full h-64 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeCoverImage}
                                        className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => coverImageRef.current?.click()}
                                    className="w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                >
                                    <div className="text-center">
                                        <ImageIcon size={48} className="mx-auto mb-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                                        <p className="text-slate-600 dark:text-slate-400 font-semibold">Upload Cover Image</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-500">JPG, PNG, GIF or WebP</p>
                                    </div>
                                </button>
                            )}
                            <input
                                ref={coverImageRef}
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                className="hidden"
                            />
                        </div>

                        {/* Title */}
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-transparent text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800 border-none focus:ring-0 outline-none p-0 tracking-tight"
                                placeholder="Your story title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="relative">
                            <textarea
                                className="w-full bg-transparent text-lg md:text-xl text-slate-600 dark:text-slate-400 placeholder:text-slate-400 dark:placeholder:text-slate-600 border-none focus:ring-0 outline-none p-0 resize-none"
                                placeholder="Write a compelling short description of your story..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative min-h-[400px]">
                            <textarea
                                className="w-full bg-transparent text-lg md:text-xl text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 border-none focus:ring-0 outline-none p-0 leading-relaxed resize-none"
                                placeholder="Tell your story... (Markdown supported)"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows="20"
                            />
                        </div>

                        {/* Tags */}
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                placeholder="Add tags separated by commas (e.g. tech, coding, tutorial)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                            <Tag size={18} className="absolute right-4 top-3.5 text-slate-400" />
                        </div>

                        {/* File Attachments */}
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-semibold"
                            >
                                <Paperclip size={20} />
                                Attach Files ({attachedFiles.length}/10)
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileAttach}
                                className="hidden"
                            />

                            {attachedFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {attachedFiles.map((file, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg"
                                        >
                                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                                📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachedFile(i)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Floating Info Bar */}
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-20">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                {readTime} min read
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                {content.split(/\s+/).filter(Boolean).length} words
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePost;
