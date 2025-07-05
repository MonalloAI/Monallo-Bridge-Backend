import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import testuserRoutes from './routes/testuserRoutes';
import contractRoutes from './routes/contractRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/contract', contractRoutes);
// 路由直接连接在
app.use('/api/test', testuserRoutes);
// 连接数据库
mongoose.connect(process.env.MONGO_URI || '', {
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

export default app;
