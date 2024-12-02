import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import amqp from "amqplib";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import axios from 'axios';

dotenv.config();

const prisma = new PrismaClient();

const QUEUE_NAME = process.env.QUEUE_NAME as string;
const RABBITMQ_URL = process.env.RABBITMQ_URL as string;
const LINK_VALIDACAO_CERTIFICADO = process.env
  .LINK_VALIDACAO_CERTIFICADO as string;

async function criarCertificado(certificadoData: any) {
  const { nome, descricao, usuarioId, eventoId } = certificadoData;

  const novoCertificado = await prisma.certificado.create({
    data: { nome, descricao, usuarioId, eventoId },
  });
  return novoCertificado;
}

type certificadoRequest = {
  conteudo: {
    nome: string;
    descricao: string;
    usuarioId: string;
    eventoId: string;
    id?: string;
  };
};

async function gerarCertificadoPdfService(certificadoData: certificadoRequest) {
  const { nome, descricao, usuarioId, eventoId, id } = certificadoData.conteudo;

  if (!usuarioId || !eventoId) {
    throw new Error("Usuário e evento são obrigatórios.");
  }

  let resultados: EventoInscricao[] = [];
  try {
    // Caso o certificado já exista, buscando dados com base no ID do certificado
    if (id) {
      resultados = await prisma.$queryRaw`
      SELECT c.id, e.nomeevento, e.descricaoevento, e.cargahoraria, u.username, u.email, e.templateId
      FROM Certificado c
      JOIN Evento e ON e.id = c.eventoid
      JOIN \`User\` u ON c.usuarioid = u.id
      JOIN Inscricao i ON i.eventoid = e.id AND i.usuarioid = u.id
      WHERE c.id = ${id}
    `;

      // Verificando se não encontrou o certificado
      if (!resultados.length) {
        throw new Error("Certificado não encontrado.");
      }

      const { nomeEvento, username, cargaHoraria, email } = resultados[0];
      const pdfBase64 = await gerarPdfCertificado({
        nomeEvento,
        username,
        cargaHoraria,
        certificadoId: id,
      });

      // Enviando e-mail com o PDF gerado
      await enviarParaFilaDeEmail({
        email,
        tipo: "envio_certificado",
        conteudo: { nome: username, evento: nomeEvento, anexo: pdfBase64 },
      });

      return { message: "Certificado gerado com sucesso.", certificadoId: id };
    } else {
      // Caso o certificado não exista, buscando dados com base no eventoId e usuarioId
      resultados = await prisma.$queryRaw`
      select e.nomeEvento, e.descricaoEvento, e.cargaHoraria, u.username, u.email, c.id as idCertificado, e.templateId
      from Inscricao i
      join \`User\` u on i.usuarioId = u.id
      join Evento e on i.eventoId = e.id
      left join Certificado c ON  c.eventoid = e.id
      where e.id = ${eventoId} and u.id = ${usuarioId}
    `;
    }

    // Verificando se não encontrou nenhum registro
    if (resultados.length === 0) {
      throw new Error(
        "Nenhum registro encontrado para o usuário e evento fornecidos."
      );
    }

    const {
      nomeEvento,
      descricaoEvento,
      cargaHoraria,
      username,
      email,
      templateId,
      idCertificado,
    } = resultados[0];

    let certificadoId = idCertificado;
    if (!idCertificado) {
      const certificadoDB = await prisma.certificado.create({
        data: {
          nome: nomeEvento,
          descricao: descricaoEvento,
          eventoId,
          usuarioId,
          updatedAt: new Date(),
        },
      });
      certificadoId = certificadoDB.id;
    }

    const templateResult = await prisma.template.findFirst({
      where: { id: templateId },
    });

    if (!templateResult) {
      throw new Error("Template de certificado não encontrado para este evento.");
    }

    const template = templateResult.template_json;

    /*const pdfBase64 = await gerarPdfCertificado({
      nomeEvento,
      username,
      cargaHoraria,
      certificadoId,
    });*/

    const pdfBase64 = await gerarPdfCertificadoComTemplate({
      template,
      data: {
        nomeEvento,
        username,
        cargaHoraria,
        certificadoId,
      },
    });

    // Atualizando o certificado com o arquivo PDF
    await prisma.certificado.update({
      where: { id: certificadoId },
      data: { arquivoPdf: pdfBase64 },
    });

    // Enviando e-mail com o PDF gerado
    await enviarParaFilaDeEmail({
      email,
      tipo: "envio_certificado",
      conteudo: { nome: username, evento: nomeEvento, anexo: pdfBase64 },
    });

    return { message: "Certificado gerado com sucesso.", certificadoId };
  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila:", error);
    throw error;
  }
}

async function gerarPdfCertificadoComTemplate({
  template,
  data,
}: {
  template: any;
  data: { nomeEvento: string; username: string; cargaHoraria: number; certificadoId: string };
}): Promise<string> {
  const { nomeEvento, username, cargaHoraria, certificadoId } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  // Se houver imagem de fundo, a adiciona
  if (template.backgroundImage) {
    const response = await axios.get(template.backgroundImage, { responseType: 'arraybuffer' });
    const imageBytes = response.data;
    const embeddedImage = await pdfDoc.embedJpg(imageBytes);
    page.drawImage(embeddedImage, { x: 0, y: 0, width: 600, height: 400 });
  }

  const fontFamily = StandardFonts.Helvetica;
  const font = await pdfDoc.embedFont(fontFamily);

  // Desenhando os campos do template
  for (const field of template.fields) {
    let text = field.label
      .replace('{nomeEvento}', nomeEvento)
      .replace('{username}', username)
      .replace('{cargaHoraria}', `${cargaHoraria}`)
      .replace('{certificadoId}', certificadoId)
      .replace('{LINK_VALIDACAO_CERTIFICADO}', `${LINK_VALIDACAO_CERTIFICADO}`);

    page.drawText(text, { x: field.x, y: field.y, size: field.size, font });  
    // Se for o campo do rodapé, dividir em duas linhas
    /*if (field.label.includes('{LINK_VALIDACAO_CERTIFICADO}')) {
      // Primeira linha do rodapé
      const footerLine1 = 'Valide seu certificado por este link:';
      const footerLine2 = `${template.LINK_VALIDACAO_CERTIFICADO}/${certificadoId}`;

      page.drawText(footerLine1, { x: 50, y: 50, size: 10, font });
      page.drawText(footerLine2, { x: 50, y: 40, size: 10, font });
    } else {
      // Outros campos (como nome, evento, etc.)
      
    }*/
  }

  // Salvando o PDF gerado
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString('base64');
}

export const enviarParaFilaDeEmail = async (message: {
  email: string;
  tipo: string;
  conteudo: { nome: string; evento: string; anexo: string };
}): Promise<void> => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log("Mensagem enviada para a fila:", message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila:", error);
    throw error;
  }
};

export const gerarPdfCertificado = async ({
  nomeEvento,
  username,
  cargaHoraria,
  certificadoId,
}: {
  nomeEvento: string;
  username: string;
  cargaHoraria: number;
  certificadoId: string;
}): Promise<string> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(`Certificado de Participação`, {
    x: 50,
    y: 350,
    size: 20,
    font,
  });
  page.drawText(`Nome: ${username}`, { x: 50, y: 300, size: 12, font });
  page.drawText(`Evento: ${nomeEvento}`, { x: 50, y: 270, size: 12, font });
  page.drawText(`Carga Horária: ${cargaHoraria} horas`, {
    x: 50,
    y: 240,
    size: 12,
    font,
  });
  page.drawText(`Id do documento: ${certificadoId}`, {
    x: 50,
    y: 210,
    size: 12,
    font,
  });

  const validationMessage = `Valide seu certificado por este link:`;
  const link = `${LINK_VALIDACAO_CERTIFICADO}/${certificadoId}`;

  page.drawText(validationMessage, { x: 50, y: 50, size: 10, font });
  page.drawText(link, { x: 50, y: 40, size: 10, font });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
};

type EventoInscricao = {
  idCertificado: string;
  nomeEvento: string;
  descricaoEvento: string;
  cargaHoraria: number;
  username: string;
  email: string;
  templateId: string;
  arquivoPdf: string;
};

export { criarCertificado, gerarCertificadoPdfService };
