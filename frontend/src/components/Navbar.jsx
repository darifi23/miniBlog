import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PenSquare, LayoutDashboard, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-dark/80 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="group flex items-center space-x-2">
                        <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
                            <span className="font-bold text-xl font-display">MB</span>
                        </div>
                        <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                            MiniBlog
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Our Story</Link>
                        <Link to="/membership" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Membership</Link>
                    </div>

                    <div className="flex items-center space-x-5">
                        {user ? (
                            <>
                                <Link to="/create-post" className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                                    <PenSquare size={20} />
                                    <span className="hidden sm:inline">Write</span>
                                </Link>
                                <Link to="/dashboard" className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                                    <LayoutDashboard size={20} />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">Log In</Link>
                                <Link to="/register" className="bg-dark dark:bg-primary-600 text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 hover:shadow-lg transition-all duration-300 shadow-md">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
