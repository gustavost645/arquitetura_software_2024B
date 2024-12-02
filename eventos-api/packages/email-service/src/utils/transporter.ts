import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Verificação das variáveis de ambiente
const serviceMail = process.env.SERVICE_MAIL || 'gmail'; 
const email = process.env.EMAIL || 'teste@teste.com';
const passMail = process.env.PASS_MAIL || 'teste';

if (!email || !passMail) {
  throw new Error('Por favor, configure as variáveis de ambiente EMAIL e PASS_MAIL.');
}

const emailTransporter: Transporter = nodemailer.createTransport({
  service: serviceMail,  
  host: 'smtp.gmail.com',  
  port: 587,  
  secure: false,  // Use true para SSL (porta 465), false para TLS (porta 587)
  auth: {
    user: email,
    pass: passMail,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

export default emailTransporter;
