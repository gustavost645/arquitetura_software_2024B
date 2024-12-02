import emailTransporter from "../utils/transporter";

// Interface para tipar os dados do e-mail
interface EmailRequest {
  email: string;
  tipo: TipoEmail;
  conteudo: Record<string, any>;
}

// Definir os tipos válidos para o campo "tipo"
type TipoEmail =
  | "inscricao_evento"
  | "presenca_evento"
  | "cancelamento_evento"
  | "envio_certificado"
  | "cancelamento_inscricao"
  | "default";

// Templates para diferentes tipos de e-mail
const templates: Record<TipoEmail, (data: Record<string, any>) => string> = {
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

const subjectTemplate: Record<TipoEmail, (data: Record<string, any>) => string> = {
  inscricao_evento: (data) => `Inscrição - ${data.evento}`,
  presenca_evento: (data) => `Confirmação de Presença - ${data.evento}`,
  cancelamento_evento: (data) => `Cancelamento - Evento ${data.evento}`,
  envio_certificado: (data) => `Certificado Disponível - ref. ${data.evento}`,
  cancelamento_inscricao: (data) => `Cancelamento - Inscrição`,
  default: () => `Informações sobre o evento`
};

// Função para enviar e-mail
export const enviarEmail = async ({ email, tipo, conteudo }: EmailRequest): Promise<void> => {
  try {
    // Seleciona o template com base no tipo informado
    const template = templates[tipo] || templates.default;
    const subject = subjectTemplate[tipo](conteudo);
    const mensagem = template(conteudo);

    // Configuração do e-mail
    const mailOptions: {
      from: string;
      to: string;
      subject: string;
      text: string;
      attachments?: {
        filename: string;
        content: string;
        encoding: string;
        contentType: string;
      }[];
    } = {
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
    await emailTransporter.sendMail(mailOptions);
    //console.log(`E-mail enviado para ${email} com sucesso!`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail para ${email}:`, error);
    throw new Error("Erro ao enviar e-mail.");
  }
};
