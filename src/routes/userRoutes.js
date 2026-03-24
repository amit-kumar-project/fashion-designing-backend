import { Router } from 'express';

export const createUserRoutes = (userController) => {
  const router = Router();

  // POST /api/users - Create a new user
  router.post('/', userController.createUser.bind(userController));

  // GET /api/users/:id - Get user by ID
  router.get('/:id', userController.getUserById.bind(userController));

  // PUT /api/users/:id - Update user
  router.put('/:id', userController.updateUser.bind(userController));

  // DELETE /api/users/:id - Delete user
  router.delete('/:id', userController.deleteUser.bind(userController));

  return router;
};
