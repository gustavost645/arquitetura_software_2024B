"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCertificado = exports.gerarCertificadoPdf = exports.deleteCertificado = exports.update = exports.save = exports.findById = exports.findAll = void 0;
const { criarCertificado, gerarCertificadoPdfService } = require('../services/certificadoService');
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const handleError = (res, error, message) => {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    res.status(500).json({ error: message, details: errorMessage });
};
const findAll = async (req, res) => {
    try {
        const certificados = await prisma.certificado.findMany();
        res.json(certificados);
    }
    catch (error) {
        handleError(res, error, "Erro ao buscar certificados");
    }
};
exports.findAll = findAll;
const findById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "ID do certificado é obrigatório." });
        return;
    }
    try {
        const certificado = await prisma.certificado.findUnique({ where: { id } });
        if (certificado) {
            res.json(certificado);
        }
        else {
            res.status(404).json({ error: "Certificado não encontrado" });
        }
    }
    catch (error) {
        handleError(res, error, "Erro ao buscar o certificado");
    }
};
exports.findById = findById;
const save = async (req, res) => {
    const { nome, descricao, usuarioId, eventoId } = req.body;
    if (!nome || !descricao || !usuarioId || !eventoId) {
        res.status(400).json({ error: "Todos os campos são obrigatórios." });
        return;
    }
    try {
        const novoCertificado = await criarCertificado({ nome, descricao, usuarioId, eventoId });
        res.status(201).json(novoCertificado);
    }
    catch (error) {
        handleError(res, error, "Erro ao criar o certificado");
    }
};
exports.save = save;
const update = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, usuarioId, eventoId } = req.body;
    if (!nome || !descricao || !usuarioId || !eventoId) {
        res.status(400).json({ error: "Todos os campos são obrigatórios." });
        return;
    }
    try {
        const certificadoAtualizado = await prisma.certificado.update({
            where: { id },
            data: { nome, descricao, usuarioId, eventoId, updatedAt: new Date() },
        });
        res.status(200).json(certificadoAtualizado);
    }
    catch (error) {
        if (error instanceof Error && error.message.includes("Record to update not found")) {
            res.status(404).json({ error: "Certificado não encontrado" });
        }
        else {
            handleError(res, error, "Erro ao atualizar o certificado");
        }
    }
};
exports.update = update;
const deleteCertificado = async (req, res) => {
    const { id } = req.params;
    try {
        const certificado = await prisma.certificado.findUnique({ where: { id } });
        if (!certificado) {
            res.status(404).json({ error: "Certificado não encontrado" });
            return;
        }
        await prisma.certificado.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        handleError(res, error, "Erro ao excluir o certificado");
    }
};
exports.deleteCertificado = deleteCertificado;
const gerarCertificadoPdf = async (req, res) => {
    const { id, usuarioId, eventoId } = req.body;
    if (!usuarioId || !eventoId) {
        res.status(400).json({ error: "Usuário e evento são obrigatórios." });
        return;
    }
    try {
        const result = await gerarCertificadoPdfService({
            id,
            usuarioId,
            eventoId
        });
        if (res.headersSent)
            return;
        res.status(200).json(result);
    }
    catch (error) {
        if (res.headersSent)
            return; // Verifica se a resposta já foi enviada
        handleError(res, error, "Erro ao gerar certificado");
    }
};
exports.gerarCertificadoPdf = gerarCertificadoPdf;
const validarCertificado = async (req, res) => {
    const { id } = req.params;
    try {
        const certificado = await prisma.certificado.findUnique({ where: { id } });
        if (certificado) {
            res.status(200).render("certificadoValido", { id });
        }
        else {
            //res.status(404).json({ error: "Certificado não encontrado" });
            res.status(200).render("certificadoInvalido", { id });
        }
    }
    catch (error) {
        handleError(res, error, "Erro ao validar o certificado");
    }
};
exports.validarCertificado = validarCertificado;
