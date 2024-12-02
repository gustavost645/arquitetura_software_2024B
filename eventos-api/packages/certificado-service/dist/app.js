"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const certificado_routes_1 = __importDefault(require("./routes/certificado.routes"));
const morgan_1 = __importDefault(require("morgan"));
const error_handler_1 = __importDefault(require("./error/error.handler"));
const success_handler_1 = __importDefault(require("./error/success.handler"));
const path_1 = __importDefault(require("path"));
const certificaoConsumer_1 = __importDefault(require("./queue/certificaoConsumer"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
// Logando as requisições
app.use((0, morgan_1.default)("dev"));
app.use(success_handler_1.default);
// Definindo as rotas
app.use("/certificado", certificado_routes_1.default);
// Inicializa o consumidor RabbitMQ junto com o servidor
(0, certificaoConsumer_1.default)()
    .then(() => {
    console.log("Consumidor RabbitMQ iniciado com sucesso.");
})
    .catch((err) => {
    console.error("Erro ao iniciar o consumidor RabbitMQ:", err);
});
// Middleware para tratamento de erros
app.use(error_handler_1.default);
exports.default = app;
