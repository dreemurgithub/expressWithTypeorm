import { Router } from 'express';
import {
  createUserController,
  getUserController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  assignRoleController
} from '../controllers/userController';

export const createUserRoutes = () => {
  const router = Router();

  router.post('/', createUserController);
  router.get('/', getAllUsersController);
  router.get('/:id', getUserController);
  router.put('/:id', updateUserController);
  router.delete('/:id', deleteUserController);
  router.post('/:userId/roles', assignRoleController);

  return router;
};
