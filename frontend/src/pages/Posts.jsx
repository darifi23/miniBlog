import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { toast } from 'react-hot-toast';

const Posts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Latest Stories</h1>
          <p className="text-slate-500 font-medium mt-2">Explore posts from the community.</p>
        </div>

        {!user && (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-6 py-3 rounded-full bg-primary-600 text-white font-bold hover:opacity-90 transition-opacity"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-xl font-medium text-slate-500 mb-4">No stories yet.</p>
          <p className="text-slate-500">Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="rounded-3xl border border-slate-100 dark:border-slate-800 p-6 hover:shadow-xl transition-shadow">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      <div className="h-10" />
    </div>
  );
};

export default Posts;

