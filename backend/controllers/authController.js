import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Email validation function
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Validate username length
        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            if (userExists.email === email) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            return res.status(400).json({ message: 'Username already taken' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
