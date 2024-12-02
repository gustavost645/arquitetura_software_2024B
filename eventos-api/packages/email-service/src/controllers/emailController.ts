import { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.utils";
import { enviarEmail } from "../services/emailService";

async function sendMail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { email, tipo, conteudo } = req.body;
  try {
    // Validação dos campos obrigatórios
    if (!email || !tipo || !conteudo) {
      sendErrorResponse( res, "Campos obrigatórios ausentes.", {  missingFields: ["email", "tipo", "conteudo"],}, 400 );
      return;
    }

    // Validação do formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sendErrorResponse( res, "E-mail inválido.", { missingFields: ["email"],}, 400 );
      return;
    }

    await enviarEmail({email, tipo, conteudo});
    sendSuccessResponse(res, 'E-mail enviado com sucesso!', {});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorDetails = error instanceof Error ? { stack: error.stack } : {};

    sendErrorResponse(res, `Erro ao enviar e-mail: ${errorMessage}`, errorDetails, 500);
  }
}

export default { sendMail };
