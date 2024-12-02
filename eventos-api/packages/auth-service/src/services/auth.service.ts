import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash.utils";
import userRepository from "../repositories/user.repository";
import { User } from "@prisma/client";
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

interface AuthResponse {
  token: string;
  username:string;
  email:string;
  userId: string;
}

async function registerUser(
  id: string | null,
  username: string,
  email: string,
  password: string
): Promise<User> {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) throw new Error("usuario ja existe com este e-mail");

  const hashedPassword = await hashPassword(password);

  const userId = id || uuidv4();

  return await userRepository.createUser({
    id: userId,
    username,
    email,
    password: hashedPassword,
  });
  
}

async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new Error("usuario não encontrado");

  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) throw new Error("senha invalida");

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
  return { token, username: user.username, email: user.email, userId: user.id };
}

/*async function findById(userId: string) {
  //return await userRepository.findById(userId);
  const user = await userRepository.findById(userId);

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;

}*/

async function findById(userId: string): Promise<Omit<User, 'password'> | null> {
  const user = await userRepository.findById(userId);

  if (!user) {
    return null;
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

async function deleteUsuario(userId: string) {
  return await userRepository.deleteUser(userId);
}

async function updateUsuario(userId: string, data: Partial<Omit<User, "id">>): Promise<User> {
  // Verifica se existe um usuário com esse ID
  const user = await userRepository.findById(userId);
  if (!user) throw new Error('Usuário não encontrado');

  if (data.password) {
    data.password = await hashPassword(data.password); 
  }

  // Atualiza os campos do usuário (somente os fornecidos)
  const updatedUser = await userRepository.updateUser(userId, data);
  return updatedUser;
}

async function hashPasswords(password: string): Promise<string> {
  return await hashPassword(password);
}

async function findAll(): Promise<User[]> {
  return await userRepository.getAllUsers(); 
}

export default {
  registerUser,
  authenticateUser,
  findById,
  deleteUsuario,
  hashPasswords,
  updateUsuario,
  findAll
};


