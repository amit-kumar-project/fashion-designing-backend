import { Router } from 'express';

export const createDesignRoutes = (designController) => {
  const router = Router();

  // POST /api/designs - Create a new design
  router.post('/', designController.createDesign.bind(designController));

  // GET /api/designs/:id - Get design by ID
  router.get('/:id', designController.getDesignById.bind(designController));

  // GET /api/designs/user/:userId - Get designs by user
  router.get('/user/:userId', designController.getDesignsByUser.bind(designController));

  // GET /api/designs/search - Search designs
  router.get('/search', designController.searchDesigns.bind(designController));

  // PUT /api/designs/:id - Update design
  router.put('/:id', designController.updateDesign.bind(designController));

  // DELETE /api/designs/:id - Delete design
  router.delete('/:id', designController.deleteDesign.bind(designController));

  return router;
};
