import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Email validation regex
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        // Validate inputs
        if (!email || !password) {
            toast.error('Email and password are required');
            return false;
        }

        if (!isValidEmail(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }

        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            toast.success('Login successful!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            toast.error(message);
            return false;
        }
    };

    const register = async (username, email, password) => {
        // Validate inputs
        if (!username || !email || !password) {
            toast.error('All fields are required');
            return false;
        }

        if (username.length < 3) {
            toast.error('Username must be at least 3 characters');
            return false;
        }

        if (!isValidEmail(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }

        try {
            const res = await api.post('/auth/register', { username, email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Registration failed';
            toast.error(message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

