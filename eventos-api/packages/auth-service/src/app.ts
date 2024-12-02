import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import morgan from "morgan";
import errorHandler from "./error/error.handler";
import logSuccess from "./error/success.handler";
import dotenv from "dotenv";

dotenv.config();

const app = express();

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
app.use("/auth", authRoutes);

// Middleware para tratamento de erros
app.use(errorHandler);

export default app;
