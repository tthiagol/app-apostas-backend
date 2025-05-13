// Arquivo de rotas de usuário: /home/ubuntu/app_apostas/backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Todas as rotas abaixo requerem autenticação, por isso usamos o middleware aqui
router.use(authMiddleware);

// Rota para obter o perfil do usuário logado
// GET /api/users/me
router.get("/me", userController.getUserProfile);

// Rota para atualizar o perfil do usuário logado
// PUT /api/users/me
router.put("/me", userController.updateUserProfile);

// Rota para obter as preferências do usuário logado
// GET /api/users/me/preferences
router.get("/me/preferences", userController.getUserPreferences);

// Rota para salvar/atualizar as preferências do usuário logado
// POST ou PUT /api/users/me/preferences
router.post("/me/preferences", userController.saveUserPreferences); // Usando POST para criar ou substituir
// Alternativamente, poderia ser PUT para substituir: router.put("/me/preferences", userController.saveUserPreferences);

module.exports = router;
