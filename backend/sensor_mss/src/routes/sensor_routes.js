import express from 'express';
import {
  getAllSensors,
  getSensorById,
  createSensor,
  updateSensor,
  deleteSensor
} from '../controllers/sensor_controller.js';
import { authenticateToken, authorizeSensorUserOrAdmin } from '../middleware/middleware.js';

const router = express.Router();

router.post('/', authenticateToken, createSensor); 
router.get('/', authenticateToken, getAllSensors);
router.get('/:id', authenticateToken, authorizeSensorUserOrAdmin, getSensorById);
router.put('/:id', authenticateToken, authorizeSensorUserOrAdmin, updateSensor);
router.delete('/:id', authenticateToken, authorizeSensorUserOrAdmin, deleteSensor);

export default router;
