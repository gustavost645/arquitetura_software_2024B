"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../prisma/client"));
async function createUser(data) {
    try {
        const newUser = await client_1.default.user.create({
            data: {
                id: data.id || undefined,
                email: data.email,
                password: data.password,
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
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Error creating user: ' + error.message);
        }
        else {
            throw new Error('erro ao salvar usuario');
        }
    }
}
async function findUserByEmail(email) {
    return await client_1.default.user.findUnique({ where: { email } });
}
async function findById(id) {
    return await client_1.default.user.findUnique({ where: { id } });
}
async function getAllUsers({ skip = 0, take = 10 } = {}) {
    return await client_1.default.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
    });
}
async function updateUser(id, data) {
    return await client_1.default.user.update({
        where: { id },
        data,
    });
}
async function deleteUser(id) {
    return await client_1.default.user.delete({
        where: { id },
    });
}
async function exportUsers() {
    const users = await client_1.default.user.findMany();
    return JSON.stringify(users, null, 2);
}
exports.default = {
    createUser,
    findUserByEmail,
    findById,
    getAllUsers,
    updateUser,
    deleteUser,
    exportUsers
};
