import express from "express";
import cors from "cors";
import inscricaoRoutes from "./routes/inscricao.routes";
import morgan from "morgan";
import errorHandler from "./error/error.handler";
import logSuccess from "./error/success.handler";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/*app.use(cors({
    origin: '*', // Permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-token']
  }));*/

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};

app.use(express.json());
app.use(cors(corsOptions));

// Logando as requisições
app.use(morgan("dev"));

app.use(logSuccess);

// Definindo as rotas
app.use("/inscricao", inscricaoRoutes);

// Middleware para tratamento de erros
app.use(errorHandler);

export default app;
