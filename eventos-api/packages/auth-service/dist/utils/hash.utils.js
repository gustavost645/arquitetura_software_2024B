"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Tipos das funções de hash
async function hashPassword(password) {
    if (password.length > 24) {
        return password;
    }
    return await bcryptjs_1.default.hash(password, 10);
}
async function comparePassword(password, hash) {
    return await bcryptjs_1.default.compare(password, hash);
}
