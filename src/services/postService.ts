import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';

const postRepository = AppDataSource.getRepository(Post);

export const createPost = async (postData: Partial<Post>) => {
  const post = postRepository.create(postData);
  return await postRepository.save(post);
};

export const getPostById = async (id: number) => {
  return await postRepository.findOne({
    where: { id },
    relations: ['user', 'comments']
  });
};

export const getAllPosts = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const [posts, total] = await postRepository.findAndCount({
    relations: ['user', 'comments'],
    skip,
    take: limit,
    order: { createdAt: 'DESC' }
  });
  
  return {
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getPostsByUser = async (userId: number) => {
  return await postRepository.find({
    where: { user: { id: userId } },
    relations: ['user', 'comments'],
    order: { createdAt: 'DESC' }
  });
};

export const updatePost = async (id: number, postData: Partial<Post>) => {
  await postRepository.update(id, postData);
  return await getPostById(id);
};

export const deletePost = async (id: number) => {
  const result = await postRepository.delete(id);
  return result.affected ? result.affected > 0 : false;
};
