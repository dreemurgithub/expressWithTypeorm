import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Role } from '../entities/Role';

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);

export const createUser = async (userData: Partial<User>) => {
  const user = userRepository.create(userData);
  return await userRepository.save(user);
};

export const getUserById = async (id: number) => {
  return await userRepository.findOne({
    where: { id },
    relations: ['posts', 'roles']
  });
};

export const getAllUsers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const [users, total] = await userRepository.findAndCount({
    relations: ['posts', 'roles'],
    skip,
    take: limit,
    order: { createdAt: 'DESC' }
  });
  
  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const updateUser = async (id: number, userData: Partial<User>) => {
  await userRepository.update(id, userData);
  return await getUserById(id);
};

export const deleteUser = async (id: number) => {
  const result = await userRepository.delete(id);
  return result.affected ? result.affected > 0 : false;
};

export const assignRoleToUser = async (userId: number, roleId: number) => {
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['roles']
  });
  
  const role = await roleRepository.findOne({ where: { id: roleId } });
  
  if (!user || !role) {
    throw new Error('User or Role not found');
  }
  
  if (!user.roles) user.roles = [];
  user.roles.push(role);
  
  return await userRepository.save(user);
};
