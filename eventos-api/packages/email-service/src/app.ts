import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import emailRoutes from "./routes/email.routes";
import logSuccess from "./error/success.handler";
import errorHandler from "./error/error.handler";
import consumeQueue from "./queue/emailConsumer";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(morgan("dev"));

app.use(logSuccess);

// Rota para envio de e-mails
app.use("/email", emailRoutes);

// Inicializa o consumidor RabbitMQ junto com o servidor
consumeQueue()
  .then(() => {
    console.log("Consumidor RabbitMQ iniciado com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao iniciar o consumidor RabbitMQ:", err);
  });

app.use(errorHandler);

export default app;
