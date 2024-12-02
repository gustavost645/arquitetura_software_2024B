import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.SERVICE_PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth service rodando na porta ${PORT}`);
});