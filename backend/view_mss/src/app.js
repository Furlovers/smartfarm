import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import viewRoutes from './routes/view_routes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*', 
  credentials: true
}));


app.use(express.json());
app.use('/view', viewRoutes);
app.use(express.json());

connectDB()

export default app;
