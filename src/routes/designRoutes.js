import { Router } from 'express';
import { 
  createDesign, 
  getDesignById, 
  getDesignsByUser, 
  searchDesigns, 
  updateDesign, 
  deleteDesign 
} from '../controllers/designController.js';

const router = Router();

// GET /api/designs/search - Search designs (must be before /:id)
router.get('/search', searchDesigns);

// GET /api/designs/user/:userId - Get designs by user
router.get('/user/:userId', getDesignsByUser);

// POST /api/designs - Create a new design
router.post('/', createDesign);

// GET /api/designs/:id - Get design by ID
router.get('/:id', getDesignById);

// PUT /api/designs/:id - Update design
router.put('/:id', updateDesign);

// DELETE /api/designs/:id - Delete design
router.delete('/:id', deleteDesign);

export default router;
