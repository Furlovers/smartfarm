import express from 'express';
import {
  createUser,
  updateUser,
  deleteUser
} from '../controllers/view_controller.js';

const router = express.Router();

router.post('/create_user', createUser);
router.put('/update_user/:userId', updateUser);
router.delete('/delete_user/:userId', deleteUser);

export default router;
