import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.EMAIL_SERVICE_PORT as string;

app.listen(PORT, () => {
  console.log(`Email Service rodando na porta ${PORT}`);
});
