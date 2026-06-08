import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import storyRoutes from './routes/storyRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize MongoDB connection
let mongoConnected = false;

async function connectMongo() {
    if (mongoConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        mongoConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    }
}

// Middleware
const corsOptions = {
    origin: [
        'https://mini-blog-frontend-rho.vercel.app',
        'https://mini-blog-frontend-3p8j93m1o-abdelwahab-darifis-projects.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health route for smoke checks - doesn't require DB
app.get('/api/health', (req, res) => {
    res.json({ 
        ok: true, 
        timestamp: new Date().toISOString(),
        mongoConnected: mongoConnected 
    });
});

// Ensure MongoDB is connected for API routes (except health)
app.use('/api/', async (req, res, next) => {
    // Skip MongoDB check for health endpoint
    if (req.path === '/health') return next();
    try {
        await connectMongo();
        next();
    } catch (error) {
        res.status(503).json({ message: 'Database connection error' });
    }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;