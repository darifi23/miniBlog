import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Send, X, Image as ImageIcon } from 'lucide-react';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/posts', { title, content });
            toast.success('Story published!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Failed to publish story');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 lg:pt-24">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Draft a Story</h1>
                <div className="flex items-center gap-4">
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
                        className="bg-primary-600 text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
                    >
                        Publish
                    </button>
                </div>
            </div>

            <form id="post-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="relative">
                    <input
                        type="text"
                        className="w-full bg-transparent text-4xl md:text-6xl font-black text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800 border-none focus:ring-0 outline-none p-0 tracking-tight"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="relative min-h-[400px]">
                    <textarea
                        className="w-full bg-transparent text-xl md:text-2xl text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none focus:ring-0 outline-none p-0 leading-relaxed resize-none"
                        placeholder="Tell your story..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows="15"
                    />
                </div>

                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white dark:bg-dark border border-slate-100 dark:border-slate-800 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-20">
                    <button type="button" className="text-slate-400 hover:text-primary-600 transition-colors">
                        <ImageIcon size={20} />
                    </button>
                    <div className="h-4 w-px bg-slate-100 dark:bg-slate-800"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Draft Saved</span>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
