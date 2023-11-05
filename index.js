import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import movieRoutes from './routes/movies.js';
import listRoutes from './routes/lists.js';

dotenv.config();
const port = process.env.PORT || 4000
const app = express();

const corsOptions = {
    origin: true,
    credentials: true
}

// connect database
mongoose.set('strictQuery', false);
const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB database connected')
    }catch(err){
        console.log('MongoDB failed to connect')
    }
}

// middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/lists', listRoutes);

app.listen(port, () => {
    connectDb();
    console.log('app is listening on port', port)
})
