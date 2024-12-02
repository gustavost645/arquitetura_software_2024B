"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarPdfCertificado = exports.enviarParaFilaDeEmail = void 0;
exports.criarCertificado = criarCertificado;
exports.gerarCertificadoPdfService = gerarCertificadoPdfService;
const pdf_lib_1 = require("pdf-lib");
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const QUEUE_NAME = process.env.QUEUE_NAME;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const LINK_VALIDACAO_CERTIFICADO = process.env
    .LINK_VALIDACAO_CERTIFICADO;
async function criarCertificado(certificadoData) {
    const { nome, descricao, usuarioId, eventoId } = certificadoData;
    const novoCertificado = await prisma.certificado.create({
        data: { nome, descricao, usuarioId, eventoId },
    });
    return novoCertificado;
}
async function gerarCertificadoPdfService(certificadoData) {
    const { nome, descricao, usuarioId, eventoId, id } = certificadoData.conteudo;
    if (!usuarioId || !eventoId) {
        throw new Error("Usuário e evento são obrigatórios.");
    }
    let resultados = [];
    try {
        // Caso o certificado já exista, buscando dados com base no ID do certificado
        if (id) {
            resultados = await prisma.$queryRaw `
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
            const pdfBase64 = await (0, exports.gerarPdfCertificado)({
                nomeEvento,
                username,
                cargaHoraria,
                certificadoId: id,
            });
            // Enviando e-mail com o PDF gerado
            await (0, exports.enviarParaFilaDeEmail)({
                email,
                tipo: "envio_certificado",
                conteudo: { nome: username, evento: nomeEvento, anexo: pdfBase64 },
            });
            return { message: "Certificado gerado com sucesso.", certificadoId: id };
        }
        else {
            // Caso o certificado não exista, buscando dados com base no eventoId e usuarioId
            resultados = await prisma.$queryRaw `
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
            throw new Error("Nenhum registro encontrado para o usuário e evento fornecidos.");
        }
        const { nomeEvento, descricaoEvento, cargaHoraria, username, email, templateId, idCertificado, } = resultados[0];
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
        await (0, exports.enviarParaFilaDeEmail)({
            email,
            tipo: "envio_certificado",
            conteudo: { nome: username, evento: nomeEvento, anexo: pdfBase64 },
        });
        return { message: "Certificado gerado com sucesso.", certificadoId };
    }
    catch (error) {
        console.error("Erro ao enviar mensagem para a fila:", error);
        throw error;
    }
}
async function gerarPdfCertificadoComTemplate({ template, data, }) {
    const { nomeEvento, username, cargaHoraria, certificadoId } = data;
    const pdfDoc = await pdf_lib_1.PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    // Se houver imagem de fundo, a adiciona
    if (template.backgroundImage) {
        const response = await axios_1.default.get(template.backgroundImage, { responseType: 'arraybuffer' });
        const imageBytes = response.data;
        const embeddedImage = await pdfDoc.embedJpg(imageBytes);
        page.drawImage(embeddedImage, { x: 0, y: 0, width: 600, height: 400 });
    }
    const fontFamily = pdf_lib_1.StandardFonts.Helvetica;
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
const enviarParaFilaDeEmail = async (message) => {
    try {
        const connection = await amqplib_1.default.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
        console.log("Mensagem enviada para a fila:", message);
        await channel.close();
        await connection.close();
    }
    catch (error) {
        console.error("Erro ao enviar mensagem para a fila:", error);
        throw error;
    }
};
exports.enviarParaFilaDeEmail = enviarParaFilaDeEmail;
const gerarPdfCertificado = async ({ nomeEvento, username, cargaHoraria, certificadoId, }) => {
    const pdfDoc = await pdf_lib_1.PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
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
exports.gerarPdfCertificado = gerarPdfCertificado;
