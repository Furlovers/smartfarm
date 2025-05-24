import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login
} from '../controllers/user_controller.js';
import { authenticateToken, authorizeUserOrAdmin } from '../middleware/middleware.js';

const router = express.Router();


router.post('/login', login);
router.post('/register', createUser);

router.get('/', authenticateToken ,  getAllUsers);
router.get('/:id', authenticateToken, authorizeUserOrAdmin, getUserById);
router.put('/:id', authenticateToken, authorizeUserOrAdmin, updateUser);
router.delete('/:id', authenticateToken,  authorizeUserOrAdmin, deleteUser);

export default router;
