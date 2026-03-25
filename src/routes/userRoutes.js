import { Router } from 'express';
import { createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

// POST /api/users - Create a new user
router.post('/', createUser);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

export default router;
