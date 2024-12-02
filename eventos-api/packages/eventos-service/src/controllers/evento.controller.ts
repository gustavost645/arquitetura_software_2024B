import { Request, Response } from "express";
import { Evento, PrismaClient, Template } from "@prisma/client";

const prisma = new PrismaClient();

const handleError = (res: Response, error: unknown, message: string) => {
  const errorMessage =
    error instanceof Error ? error.message : "Erro desconhecido";
  res.status(500).json({ error: message, details: errorMessage });
};

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventos = await prisma.evento.findMany();
    res.json(eventos);
  } catch (error) {
    handleError(res, error, "Erro ao buscar eventos");
  }
};

export const findAllByUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const eventos = await prisma.$queryRaw<Evento[]>`SELECT e.* 
                                                      FROM Evento e
                                                      WHERE NOT EXISTS (
                                                        SELECT 1
                                                        FROM Inscricao i
                                                        WHERE i.eventoId = e.id
                                                        AND i.usuarioId = ${userId}
                                                      );
                                                    `;

    res.json(eventos);
  } catch (error) {
    handleError(res, error, "Erro ao buscar eventos");
  }
};

export const findById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "ID do evento é obrigatório." });
    return;
  }

  try {
    const evento = await prisma.evento.findUnique({ where: { id } });
    if (evento) {
      res.json(evento);
    } else {
      res.status(404).json({ error: "evento não encontrado" });
    }
  } catch (error) {
    handleError(res, error, "Erro ao buscar o evento");
  }
};

export const save = async (req: Request, res: Response): Promise<void> => {
  const { id, nomeEvento, descricaoEvento, cargaHoraria, templateId } = req.body;

  if (!nomeEvento || !descricaoEvento || !cargaHoraria || !templateId) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return;
  }

  try {
    const eventData: any = {
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
  } catch (error) {
    handleError(res, error, "Erro ao criar o evento");
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nomeEvento, descricaoEvento, cargaHoraria , templateId} = req.body;

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
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      res.status(404).json({ error: "evento não encontrado" });
    } else {
      handleError(res, error, "Erro ao atualizar o evento");
    }
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento) {
      res.status(404).json({ error: "evento não encontrado" });
      return;
    }
    await prisma.evento.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "Erro ao excluir o evento");
  }
};

interface AuthRequest extends Request {
  userId?: string;
};

export const findTempate = async (req: Request, res: Response): Promise<void> => {
  try {
    const templates = await prisma.$queryRaw<Template[]>`SELECT t.* 
                                                     FROM Template t
                                                    `;
    res.json(templates);
  } catch (error) {
    handleError(res, error, "Erro ao buscar templates");
  }
};

