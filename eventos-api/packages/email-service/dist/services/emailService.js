"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarEmail = void 0;
const transporter_1 = __importDefault(require("../utils/transporter"));
// Templates para diferentes tipos de e-mail
const templates = {
    inscricao_evento: (data) => `
    Olá ${data.nome},
    Você se cadastrou no evento: ${data.evento}.
    Data: ${data.data}.
    Obrigado por se inscrever!
  `,
    presenca_evento: (data) => `
    Olá ${data.nome},
    Você registrou presença no evento: ${data.evento}.
    Data: ${data.data}.
    Bom Evento!
    `,
    cancelamento_evento: (data) => `
    Olá ${data.nome},
    Lamentamos informar que o evento: ${data.evento} foi cancelado.
    Data: ${data.data}.
    Pedimos desculpas pelo inconveniente.
  `,
    envio_certificado: (data) => `
    Prezado(a) ${data.nome},
    Segue em anexo o certificado do evento ${data.evento}.
    Obrigado por participar!
  `,
    cancelamento_inscricao: (data) => `
    Olá ${data.nome},
    Você cancelou sua inscrição no evento: ${data.evento}.
    Caso tenha sido um engano ou mude de ideia, entre em contato conosco.
  `,
    default: () => `
    Olá,
    Este é um e-mail padrão.
  `
};
const subjectTemplate = {
    inscricao_evento: (data) => `Inscrição - ${data.evento}`,
    presenca_evento: (data) => `Confirmação de Presença - ${data.evento}`,
    cancelamento_evento: (data) => `Cancelamento - Evento ${data.evento}`,
    envio_certificado: (data) => `Certificado Disponível - ref. ${data.evento}`,
    cancelamento_inscricao: (data) => `Cancelamento - Inscrição`,
    default: () => `Informações sobre o evento`
};
// Função para enviar e-mail
const enviarEmail = async ({ email, tipo, conteudo }) => {
    try {
        // Seleciona o template com base no tipo informado
        const template = templates[tipo] || templates.default;
        const subject = subjectTemplate[tipo](conteudo);
        const mensagem = template(conteudo);
        // Configuração do e-mail
        const mailOptions = {
            from: '"SAGE - Sistema de Eventos" <seu-email@gmail.com>',
            to: email,
            subject: subject,
            text: mensagem,
        };
        // Adiciona o anexo se fornecido
        if (conteudo.anexo) {
            mailOptions.attachments = [
                {
                    filename: `Certificado_${conteudo.evento}_${conteudo.nome}.pdf`,
                    content: conteudo.anexo,
                    encoding: 'base64',
                    contentType: 'application/pdf',
                },
            ];
        }
        // Envia o e-mail
        await transporter_1.default.sendMail(mailOptions);
        //console.log(`E-mail enviado para ${email} com sucesso!`);
    }
    catch (error) {
        console.error(`Erro ao enviar e-mail para ${email}:`, error);
        throw new Error("Erro ao enviar e-mail.");
    }
};
exports.enviarEmail = enviarEmail;
