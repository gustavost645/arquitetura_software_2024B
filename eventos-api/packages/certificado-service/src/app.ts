import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import certificadoRoutes from "./routes/certificado.routes";
import morgan from "morgan";
import errorHandler from "./error/error.handler";
import logSuccess from "./error/success.handler";
import path from "path";
import consumeQueue from "./queue/certificaoConsumer";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};

app.use(express.json());
app.use(cors(corsOptions));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Logando as requisições
app.use(morgan("dev"));

app.use(logSuccess);

// Definindo as rotas
app.use("/certificado", certificadoRoutes);

// Inicializa o consumidor RabbitMQ junto com o servidor
consumeQueue()
  .then(() => {
    console.log("Consumidor RabbitMQ iniciado com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao iniciar o consumidor RabbitMQ:", err);
  });

// Middleware para tratamento de erros
app.use(errorHandler);

export default app;
