// Arquivo principal do servidor: /home/ubuntu/app_apostas/backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Adicionar esta linha

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());
app.use(cors()); // Adicionar esta linha para habilitar CORS para todas as origens

// Rota de teste inicial
app.get("/api", (req, res) => {
  res.json({ message: "Bem-vindo à API do App de Apostas Esportivas!" });
});

// Importar e usar rotas de autenticação e usuários
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; // Para possíveis testes

