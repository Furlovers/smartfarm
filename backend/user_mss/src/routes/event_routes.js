import express from 'express';
import { addSensor, removeSensor } from '../services/user_service.js';

const router = express.Router();

const functions = {
  SensorCreate: async (data) => {
    await addSensor(data.user_id, data.sensor_id)
  },
  SensorDelete: async (data) => {
    await removeSensor(data.user_id, data.sensor_id)
  },
}

router.post('/', (req, res) => {
  const event = req.body
  if(functions[event.type]){
    functions[event.type](event.data)
  }
  res.end()  
});

export default router;
