"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTempate = exports.remove = exports.update = exports.save = exports.findById = exports.findAllByUser = exports.findAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const handleError = (res, error, message) => {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    res.status(500).json({ error: message, details: errorMessage });
};
const findAll = async (req, res) => {
    try {
        const eventos = await prisma.evento.findMany();
        res.json(eventos);
    }
    catch (error) {
        handleError(res, error, "Erro ao buscar eventos");
    }
};
exports.findAll = findAll;
const findAllByUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Usuário não autenticado." });
            return;
        }
        const eventos = await prisma.$queryRaw `SELECT e.* 
                                                      FROM Evento e
                                                      WHERE NOT EXISTS (
                                                        SELECT 1
                                                        FROM Inscricao i
                                                        WHERE i.eventoId = e.id
                                                        AND i.usuarioId = ${userId}
                                                      );
                                                    `;
        res.json(eventos);
    }
    catch (error) {
        handleError(res, error, "Erro ao buscar eventos");
    }
};
exports.findAllByUser = findAllByUser;
const findById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "ID do evento é obrigatório." });
        return;
    }
    try {
        const evento = await prisma.evento.findUnique({ where: { id } });
        if (evento) {
            res.json(evento);
        }
        else {
            res.status(404).json({ error: "evento não encontrado" });
        }
    }
    catch (error) {
        handleError(res, error, "Erro ao buscar o evento");
    }
};
exports.findById = findById;
const save = async (req, res) => {
    const { id, nomeEvento, descricaoEvento, cargaHoraria, templateId } = req.body;
    if (!nomeEvento || !descricaoEvento || !cargaHoraria || !templateId) {
        res.status(400).json({ error: "Todos os campos são obrigatórios." });
        return;
    }
    try {
        const eventData = {
            nomeEvento,
            descricaoEvento,
            cargaHoraria,
            templateId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        if (id && id !== null && id !== "") {
            eventData.id = id;
        }
        // Criar o evento no banco de dados
        const novoevento = await prisma.evento.create({
            data: eventData,
        });
        res.status(201).json(novoevento);
    }
    catch (error) {
        handleError(res, error, "Erro ao criar o evento");
    }
};
exports.save = save;
const update = async (req, res) => {
    const { id } = req.params;
    const { nomeEvento, descricaoEvento, cargaHoraria, templateId } = req.body;
    if (!nomeEvento || !descricaoEvento || !cargaHoraria || !templateId) {
        res.status(400).json({ error: "Todos os campos são obrigatórios." });
        return;
    }
    try {
        const eventoAtualizado = await prisma.evento.update({
            where: { id },
            data: {
                nomeEvento,
                descricaoEvento,
                cargaHoraria,
                templateId,
                updatedAt: new Date(),
            },
        });
        res.status(200).json(eventoAtualizado);
    }
    catch (error) {
        if (error instanceof Error &&
            error.message.includes("Record to update not found")) {
            res.status(404).json({ error: "evento não encontrado" });
        }
        else {
            handleError(res, error, "Erro ao atualizar o evento");
        }
    }
};
exports.update = update;
const remove = async (req, res) => {
    const { id } = req.params;
    try {
        const evento = await prisma.evento.findUnique({ where: { id } });
        if (!evento) {
            res.status(404).json({ error: "evento não encontrado" });
            return;
        }
        await prisma.evento.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        handleError(res, error, "Erro ao excluir o evento");
    }
};
exports.remove = remove;
;
const findTempate = async (req, res) => {
    try {
        const templates = await prisma.$queryRaw `SELECT t.* 
                                                     FROM Template t
                                                    `;
        res.json(templates);
    }
    catch (error) {
        handleError(res, error, "Erro ao buscar templates");
    }
};
exports.findTempate = findTempate;
