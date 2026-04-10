import { Router } from 'express';
import { getAllUsers, getAllDesigns } from '../controllers/adminController.js';
import { protect, authorizeAdmin } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.use(authorizeAdmin);

// GET /api/admin/users - admin screen users listing
router.get('/users', getAllUsers);

// GET /api/admin/designs - admin screen designs listing
router.get('/designs', getAllDesigns);

export default router;
