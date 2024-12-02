const { criarCertificado, gerarCertificadoPdfService } = require('../services/certificadoService');
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PDFDocument, StandardFonts } from "pdf-lib";
import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const handleError = (res: Response, error: unknown, message: string) => {
  const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
  res.status(500).json({ error: message, details: errorMessage });
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const certificados = await prisma.certificado.findMany();
    res.json(certificados);
  } catch (error) {
    handleError(res, error, "Erro ao buscar certificados");
  }
};

export const findById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    res.status(400).json({ error: "ID do certificado é obrigatório." });
    return ;
  }

  try {
    const certificado = await prisma.certificado.findUnique({ where: { id } });
    if (certificado) {
      res.json(certificado);
    } else {
      res.status(404).json({ error: "Certificado não encontrado" });
    }
  } catch (error) {
    handleError(res, error, "Erro ao buscar o certificado");
  }
};

export const save = async (req: Request, res: Response): Promise<void> => {
  const { nome, descricao, usuarioId, eventoId } = req.body;

  if (!nome || !descricao || !usuarioId || !eventoId) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return;
  }

  try {
    const novoCertificado = await criarCertificado({ nome, descricao, usuarioId, eventoId });
    res.status(201).json(novoCertificado);
  } catch (error) {
    handleError(res, error, "Erro ao criar o certificado");
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      res.status(404).json({ error: "Certificado não encontrado" });
    } else {
      handleError(res, error, "Erro ao atualizar o certificado");
    }
  }
};

export const deleteCertificado = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const certificado = await prisma.certificado.findUnique({ where: { id } });
    if (!certificado) {
      res.status(404).json({ error: "Certificado não encontrado" });
      return;
    }
    await prisma.certificado.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "Erro ao excluir o certificado");
  }
};

export const gerarCertificadoPdf = async (req: Request, res: Response): Promise<void> => {
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

    if (res.headersSent) return;

    res.status(200).json(result);
  } catch (error) {
    if (res.headersSent) return; // Verifica se a resposta já foi enviada
    handleError(res, error, "Erro ao gerar certificado");
  }
};

export const validarCertificado = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const certificado = await prisma.certificado.findUnique({ where: { id } });
    if (certificado) {
      res.status(200).render("certificadoValido", { id });
    } else {
      //res.status(404).json({ error: "Certificado não encontrado" });
      res.status(200).render("certificadoInvalido", { id });
    }
  } catch (error) {
    handleError(res, error, "Erro ao validar o certificado");
  }
};

type EventoInscricao = {
  id: string;
  nomeEvento: string;
  descricaoEvento: string;
  cargaHoraria: number;
  username: string;
  email: string;
  arquivoPdf: string;
};
