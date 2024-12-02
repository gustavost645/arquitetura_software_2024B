import prisma from '../prisma/client';
import { User } from '@prisma/client';

// Define o tipo para parâmetros opcionais de listagem
interface PaginationOptions {
  skip?: number;
  take?: number;
}

async function createUser(data: Partial<Omit<User, "updatedAt">>): Promise<User> {
  try {

    const newUser = await prisma.user.create({
      data: {
        id: data.id || undefined,
        email: data.email as string,
        password: data.password as string,
        username: data.username || '', 
        logradouro: data.logradouro || '', 
        numero: data.numero || '',
        bairro: data.bairro || '',
        cidade: data.cidade || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return newUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating user: ' + error.message);
    } else {
      throw new Error('erro ao salvar usuario');
    }
  }
}

async function findUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}

async function findById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

async function getAllUsers({ skip = 0, take = 10 }: PaginationOptions = {}): Promise<User[]> {
  return await prisma.user.findMany({
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
}

async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

async function deleteUser(id: string): Promise<User> {
  return await prisma.user.delete({
    where: { id },
  });
}

async function exportUsers(): Promise<string> {
  const users = await prisma.user.findMany();
  return JSON.stringify(users, null, 2);
}


export default {
  createUser,
  findUserByEmail,
  findById,
  getAllUsers,
  updateUser,
  deleteUser,
  exportUsers
};
