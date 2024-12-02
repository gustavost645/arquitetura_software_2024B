import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const QUEUE_NAME = process.env.QUEUE_NAME as string;
const QUEUE_CERTIFICADO_NAME = process.env.QUEUE_CERTIFICADO_NAME as string;
const RABBITMQ_URL = process.env.RABBITMQ_URL as string;

const prisma = new PrismaClient();

const handleError = (res: Response, error: unknown, message: string) => {
  const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
  res.status(500).json({ error: message, details: errorMessage });
};

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const lista = await prisma.inscricao.findMany();
    res.json(lista);
  } catch (error) {
    handleError(res, error, "Erro ao buscar inscricoes");
  }
};

export const findAllByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return ;
    }

    const inscricoes = await prisma.$queryRaw<InscricaoRequest[]>`select i.id
                                                                  ,      i.eventoId 
                                                                  ,      i.usuarioId 
                                                                  ,      e.nomeEvento 
                                                                  ,      e.descricaoEvento 
                                                                  ,      e.cargaHoraria
                                                                  ,      i.presente 
                                                                  from   Inscricao i
                                                                  ,      Evento e
                                                                  where  i.eventoId = e.id 
                                                                  and    i.usuarioId = ${userId}
                                                                  order by i.createdAt asc
                                                                `;


    res.json(inscricoes);
  } catch (error) {
    handleError(res, error, "Erro ao buscar inscrições");
  }
};

export const findById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    res.status(400).json({ error: "ID do inscricao é obrigatório." });
    return ;
  }

  try {
    const inscricao = await prisma.inscricao.findUnique({ where: { id } });
    if (inscricao) {
      res.json(inscricao);
    } else {
      res.status(404).json({ error: "Inscrição não encontrada" });
    }
  } catch (error) {
    handleError(res, error, "Erro ao buscar a inscrição");
  }
};

export const save = async (req: Request, res: Response): Promise<void> => {
  const { id, usuarioId, eventoId, presente } = req.body;

  if (!usuarioId || !eventoId) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return;
  }

    try {
      const eventData: any = {
        usuarioId,
        eventoId,
        presente,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (id && id !== null && id !== '') {
        eventData.id = id;
      }

      const novoinscricao = await prisma.inscricao.create({
        data: eventData,
      });

     const inscricaoDB = await prisma.$queryRaw<InscricaoWithUsuarioAndEventoRequest[]>` SELECT i.id AS inscricaoId, u.email, u.username AS usuarioNome, e.nomeEvento AS nomeEvento
                                                                                 FROM Inscricao i
                                                                                 INNER JOIN \`User\` u ON i.usuarioId = u.id
                                                                                 INNER JOIN Evento e ON i.eventoId = e.id
                                                                                 WHERE i.usuarioId = ${usuarioId} AND i.eventoId = ${eventoId}
                                                                                 LIMIT 1;
                                                                              `;
      const { inscricaoId, email, usuarioNome, nomeEvento } = inscricaoDB[0];

      await sendToQueueEmail({
      email,
      tipo: "inscricao_evento",
      conteudo: { nome: usuarioNome, evento: nomeEvento },
      });

      res.status(201).json(novoinscricao);
    } catch (error) {
      handleError(res, error, "Erro ao criar o inscricao");
    }

};

export const update = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { usuarioId, eventoId, presente } = req.body;

  if (!id || !usuarioId || !eventoId) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return;
  }

  try {
    const inscricaoAtualizado = await prisma.inscricao.update({
      where: { id },
      data: { usuarioId, eventoId, presente, updatedAt: new Date() },
    });
    res.status(200).json(inscricaoAtualizado);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      res.status(404).json({ error: "inscricao não encontrado" });
    } else {
      handleError(res, error, "Erro ao atualizar o inscricao");
    }
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const inscricao = await prisma.inscricao.findUnique({ where: { id } });
    if (!inscricao) {
      res.status(404).json({ error: "inscricao não encontrado" });
      return;
    }
    await prisma.inscricao.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "Erro ao excluir o inscricao");
  }
};

export const presenca = async (req: Request, res: Response): Promise<void> => {
  const { usuarioId, eventoId } = req.body;
  
  if (!usuarioId || !eventoId) {
    res.status(400).json({ error: "todos os campos são obrigatório." });
    return ;
  }

  try {
    const inscricao = await prisma.inscricao.findFirst({ where: { usuarioId , eventoId } });
    if (inscricao) {
      await prisma.inscricao.update({
        where: { id: inscricao.id },
        data: { usuarioId, eventoId, presente: true, updatedAt: new Date() },
      });

      const inscricaoDB = await prisma.$queryRaw<InscricaoWithUsuarioAndEventoRequest[]>` SELECT i.id AS inscricaoId, u.email, u.username AS usuarioNome, e.nomeEvento AS nomeEvento
                                              FROM Inscricao i
                                              INNER JOIN \`User\` u ON i.usuarioId = u.id
                                              INNER JOIN Evento e ON i.eventoId = e.id
                                              WHERE i.usuarioId = ${usuarioId} AND i.eventoId = ${eventoId}
                                              LIMIT 1;
                                            `;
      const { inscricaoId, email, usuarioNome, nomeEvento } = inscricaoDB[0];

      await sendToQueueEmail({
        email,
        tipo: "presenca_evento",
        conteudo: { nome: usuarioNome, evento: nomeEvento },
      });

      res.status(200).json({message: "Presença registrada."});

    } else {
      res.status(404).json({ error: "inscricao não encontrado" });
    }
  } catch (error) {
    handleError(res, error, "Erro ao buscar o inscricao");
  }
};

export const certificado = async (req: Request, res: Response): Promise<void> => {
  const { usuarioId, eventoId } = req.body;

  if (!usuarioId || !eventoId) {
    res.status(400).json({ error: "todos os campos são obrigatório." });
    return ;
  }

  try {
    const retornoDB = await prisma.$queryRaw<InscricaoWithUsuarioAndEventoRequest[]>` SELECT e.nomeEvento AS nomeEvento, e.descricaoEvento as descricaoEvento
                                                                              FROM Inscricao i
                                                                              INNER JOIN \`User\` u ON i.usuarioId = u.id
                                                                              INNER JOIN Evento e ON i.eventoId = e.id
                                                                              WHERE i.usuarioId = ${usuarioId} AND i.eventoId = ${eventoId}
                                                                              LIMIT 1;`;

    const { nomeEvento, descricaoEvento } = retornoDB[0];

    if(nomeEvento || descricaoEvento){
      

        await sendToQueueCertificado({
          conteudo: { nome:nomeEvento, descricao:descricaoEvento, usuarioId, eventoId },
        });

        res.status(200).json({message: "Certificado foi enviado para o seu email."});

    } else {
      res.status(404).json({error: "problema na ggeração do certificado."});
    }
  } catch(error) {
    handleError(res, error, "Erro na geracao do certificao.");
  }
};

export const cancelamento = async (req: Request, res: Response): Promise<void> => {
  const { usuarioId, eventoId } = req.body;
  
  if (!usuarioId || !eventoId) {
    res.status(400).json({ error: "todos os campos são obrigatório." });
    return ;
  }

  try {
    const inscricao = await prisma.$queryRaw<InscricaoWithUsuarioAndEventoRequest[]>` SELECT i.id AS inscricaoId, u.email, u.username AS usuarioNome, e.nomeEvento AS eventoNome
                                              FROM Inscricao i
                                              INNER JOIN \`User\` u ON i.usuarioId = u.id
                                              INNER JOIN Evento e ON i.eventoId = e.id
                                              WHERE i.usuarioId = ${usuarioId} AND i.eventoId = ${eventoId}
                                              LIMIT 1;
                                            `;
    
    if (inscricao) {
      const { inscricaoId, email, usuarioNome, nomeEvento } = inscricao[0];

      await prisma.inscricao.delete({ where: { id: inscricaoId } });

      await sendToQueueEmail({
        email,
        tipo: "cancelamento_inscricao",
        conteudo: { nome: usuarioNome, evento: nomeEvento },
      });

      res.status(200).json({message: "Cancelamento efetuado com sucesso"});

    } else {
      res.status(404).json({ error: "inscricao não encontrado" });
    }
  } catch (error) {
    handleError(res, error, "Erro ao buscar o inscricao");
  }
};

export const sendToQueueCertificado = async (message: {
  conteudo: { nome: string; descricao: string; usuarioId: string, eventoId: string };
}): Promise<void> => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_CERTIFICADO_NAME, { durable: true });
    channel.sendToQueue(QUEUE_CERTIFICADO_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });

    //console.log("Mensagem enviada para a fila:", message);

    await channel.close();
    await connection.close();

  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila:", error);
    throw error;
  }
};


export const sendToQueueEmail = async (message: {
  email: string;
  tipo: string;
  conteudo: { nome: string; evento: string; anexo?: string };
}): Promise<void> => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });

    //console.log("Mensagem enviada para a fila:", message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila:", error);
    throw error;
  }
};


type InscricaoWithUsuarioAndEventoRequest = {
  inscricaoId: string;
  email: string;
  usuarioNome: string;
  nomeEvento: string;
  descricaoEvento: string;
};

type InscricaoRequest = {
  id:string;
  eventoId:string; 
  usuarioId:string;
  nomeEvento: string;
  descricaoEvento: string;
  cargaHoraria:string;
  presente: boolean;
};

interface AuthRequest extends Request {
  userId?: string;
};
