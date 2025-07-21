import { Router } from 'express';
import { createUserRoutes } from './userRoutes';
import { createPostRoutes } from './postRoutes';

export const createRoutes = () => {
  const router = Router();

  router.use('/users', createUserRoutes());
  router.use('/posts', createPostRoutes());

  return router;
};
