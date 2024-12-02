import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.INSCRICAO_SERVICE_PORT as string;

app.listen(PORT, () => {
  console.log(`Inscricoes service rodando na porta ${PORT}`);
});