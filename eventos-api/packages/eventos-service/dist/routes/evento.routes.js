"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const evento_middleware_1 = __importDefault(require("../middlewares/evento.middleware"));
const eventoController = __importStar(require("../controllers/evento.controller"));
const router = (0, express_1.Router)();
// crud
router.get('/', evento_middleware_1.default, eventoController.findAllByUser);
router.get('/list', evento_middleware_1.default, eventoController.findAll);
router.get('/template', evento_middleware_1.default, eventoController.findTempate);
router.get('/:id', evento_middleware_1.default, eventoController.findById);
router.post('/', evento_middleware_1.default, eventoController.save);
router.put('/:id', evento_middleware_1.default, eventoController.update);
router.delete('/:id', evento_middleware_1.default, eventoController.remove);
exports.default = router;
