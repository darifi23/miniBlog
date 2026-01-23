import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(email, password);
        setIsLoading(false);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] relative">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary-500/20 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-accent-500/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/40 dark:border-slate-700/50"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                        Don't have an account? <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-bold hover:underline transition-colors">Sign Up</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
