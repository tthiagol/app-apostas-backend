// Arquivo de middleware de autenticação: /home/ubuntu/app_apostas/backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "seuSuperSegredoJWT";

module.exports = function(req, res, next) {
  // Obter o token do header
  const authHeader = req.header("Authorization");

  // Verificar se não há token
  if (!authHeader) {
    return res.status(401).json({ message: "Nenhum token, autorização negada." });
  }

  // Verificar se o token está no formato Bearer
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Token mal formatado." });
  }

  const token = parts[1];

  try {
    // Verificar o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Adicionar o usuário do payload do token ao objeto req
    req.user = decoded; // Geralmente contém o id do usuário e outras infos que você colocou no token
    next();
  } catch (err) {
    console.error("Erro na verificação do token:", err.message);
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expirado." });
    }
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Token inválido." });
    }
    res.status(500).json({ message: "Erro no servidor ao validar token." });
  }
};
