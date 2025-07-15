import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import lockRoutes from './routes/lockRoutes';
// import contractRoutes from './routes/contractRoutes(保留)';
import  cross  from "./routes/cross"; 
import users from './routes/users'
import logs from "./routes/logs";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// app.use('/api/lock', contractRoutes);
app.use('/api',lockRoutes,cross, users, logs);
// 连接数据库
mongoose.connect(process.env.MONGO_URI || '', {
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

export default app;
