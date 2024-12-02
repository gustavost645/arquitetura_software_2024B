import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.EVENTO_SERVICE_PORT as string;

app.listen(PORT, () => {
  console.log(`Eventos service rodando na porta ${PORT}`);
});