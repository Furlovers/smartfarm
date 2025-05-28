import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import readingRoutes from './routes/reading_routes.js';
import eventRoutes from './routes/event_routes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.json());
app.use('/readings', readingRoutes);
app.use('/event', eventRoutes);

connectDB();

export default app;
