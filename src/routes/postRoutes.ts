import { Router } from 'express';
import {
  createPostController,
  getPostController,
  getAllPostsController,
  getUserPostsController,
  updatePostController,
  deletePostController
} from '../controllers/postController';

export const createPostRoutes = () => {
  const router = Router();

  router.post('/', createPostController);
  router.get('/', getAllPostsController);
  router.get('/:id', getPostController);
  router.get('/user/:userId', getUserPostsController);
  router.put('/:id', updatePostController);
  router.delete('/:id', deletePostController);

  return router;
};
