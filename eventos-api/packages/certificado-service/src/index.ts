import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.CERTIFICADO_SERVICE_PORT as String;

app.listen(PORT, () => {
  console.log(`Certificado service rodando na porta ${PORT}`);
});