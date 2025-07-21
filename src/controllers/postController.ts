import { Request, Response } from 'express';
import { 
  createPost, 
  getPostById, 
  getAllPosts, 
  getPostsByUser,
  updatePost, 
  deletePost 
} from '../services/postService';

export const createPostController = async (req: Request, res: Response) => {
  try {
    const post = await createPost(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getPostController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const post = await getPostById(id);
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await getAllPosts(page, limit);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getUserPostsController = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const posts = await getPostsByUser(userId);
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const updatePostController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const post = await updatePost(id, req.body);
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await deletePost(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};
