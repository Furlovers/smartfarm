import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import sensorRoutes from './routes/sensor_routes.js';
import eventRoutes from './routes/event_routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/sensors', sensorRoutes);
app.use('/event', eventRoutes);

connectDB();

export default app;
