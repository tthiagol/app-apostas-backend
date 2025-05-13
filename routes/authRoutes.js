// Arquivo de rotas de autenticação: /home/ubuntu/app_apostas/backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rota para registrar um novo usuário
// POST /api/auth/register
router.post("/register", authController.registerUser);

// Rota para login de usuário
// POST /api/auth/login
router.post("/login", authController.loginUser);

// TODO: Adicionar rota para refresh token, se necessário no futuro
// TODO: Adicionar rota para logout (pode envolver blacklisting de token)

module.exports = router;
