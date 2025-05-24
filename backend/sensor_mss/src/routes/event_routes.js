import express from 'express';
import { addReading } from '../services/sensor_service';

const router = express.Router();

const functions = {
  EventCreate: async (data) => {
    await addReading(data.sensor_id, data.reading_id)
  },
}

router.post('/', (req, res) => {
  const event = req.body
  functions[event.type](event.data)
  res.end()  
});

export default router;
