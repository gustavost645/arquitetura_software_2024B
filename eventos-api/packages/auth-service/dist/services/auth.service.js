"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hash_utils_1 = require("../utils/hash.utils");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
async function registerUser(id, username, email, password) {
    const existingUser = await user_repository_1.default.findUserByEmail(email);
    if (existingUser)
        throw new Error("usuario ja existe com este e-mail");
    const hashedPassword = await (0, hash_utils_1.hashPassword)(password);
    const userId = id || (0, uuid_1.v4)();
    return await user_repository_1.default.createUser({
        id: userId,
        username,
        email,
        password: hashedPassword,
    });
}
async function authenticateUser(email, password) {
    const user = await user_repository_1.default.findUserByEmail(email);
    if (!user)
        throw new Error("usuario não encontrado");
    const passwordMatch = await (0, hash_utils_1.comparePassword)(password, user.password);
    if (!passwordMatch)
        throw new Error("senha invalida");
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    return { token, username: user.username, email: user.email, userId: user.id };
}
/*async function findById(userId: string) {
  //return await userRepository.findById(userId);
  const user = await userRepository.findById(userId);

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;

}*/
async function findById(userId) {
    const user = await user_repository_1.default.findById(userId);
    if (!user) {
        return null;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
async function deleteUsuario(userId) {
    return await user_repository_1.default.deleteUser(userId);
}
async function updateUsuario(userId, data) {
    // Verifica se existe um usuário com esse ID
    const user = await user_repository_1.default.findById(userId);
    if (!user)
        throw new Error('Usuário não encontrado');
    if (data.password) {
        data.password = await (0, hash_utils_1.hashPassword)(data.password);
    }
    // Atualiza os campos do usuário (somente os fornecidos)
    const updatedUser = await user_repository_1.default.updateUser(userId, data);
    return updatedUser;
}
async function hashPasswords(password) {
    return await (0, hash_utils_1.hashPassword)(password);
}
async function findAll() {
    return await user_repository_1.default.getAllUsers();
}
exports.default = {
    registerUser,
    authenticateUser,
    findById,
    deleteUsuario,
    hashPasswords,
    updateUsuario,
    findAll
};
