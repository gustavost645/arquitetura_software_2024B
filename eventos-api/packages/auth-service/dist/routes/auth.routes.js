"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
// Rotas de autenticação
router.post('/login', auth_controller_1.default.login);
// rotas referente ao usuario
router.post('/register', auth_controller_1.default.register);
router.get('/users', auth_middleware_1.default, auth_controller_1.default.findAllUsers);
router.get('/users/:id', auth_middleware_1.default, auth_controller_1.default.findUser);
router.put('/users/:id', auth_middleware_1.default, auth_controller_1.default.updateUser);
router.delete('/users/:id', auth_middleware_1.default, auth_controller_1.default.deleteUser);
// Rota protegida
router.get('/protected', auth_middleware_1.default, (req, res) => {
    res.status(200).json({ message: 'Access granted' });
});
exports.default = router;
