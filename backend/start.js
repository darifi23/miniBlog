import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './server.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then((conn) => {
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
