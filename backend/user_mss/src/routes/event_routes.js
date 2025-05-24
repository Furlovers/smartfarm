import express from 'express';
import { addSensor } from '../services/user_service.js';

const router = express.Router();

const functions = {
  SensorCreate: async (data) => {
    await addSensor(data.user_id, data.sensor_id)
  },
}

router.post('/', (req, res) => {
  const event = req.body
  functions[event.type](event.data)
  res.end()  
});

export default router;
