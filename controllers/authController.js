// Arquivo de controllers de autenticação: /home/ubuntu/app_apostas/backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Configuração do banco de dados
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "seuSuperSegredoJWT"; // Mova para .env em produção
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Registrar um novo usuário
exports.registerUser = async (req, res) => {
  const { nome_usuario, email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  try {
    // Verificar se o usuário já existe
    const userExists = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: "Usuário com este e-mail já existe." });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    // Inserir novo usuário no banco
    const newUserQuery = "INSERT INTO usuarios (nome_usuario, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome_usuario, email, data_cadastro";
    const newUser = await db.query(newUserQuery, [nome_usuario, email, senha_hash]);

    // Criar tabela de preferências padrão para o novo usuário (opcional, pode ser no onboarding)
    // await db.query("INSERT INTO preferencias_usuario (id_usuario) VALUES ($1)", [newUser.rows[0].id]);

    // Gerar token JWT (opcionalmente, pode logar direto ou pedir para logar)
    // const token = jwt.sign({ id: newUser.rows[0].id, email: newUser.rows[0].email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: newUser.rows[0],
      // token: token // se logar direto
    });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor ao registrar usuário." });
  }
};

// Login de usuário
exports.loginUser = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  try {
    // Verificar se o usuário existe
    const userQuery = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas." }); // Usuário não encontrado
    }

    const user = userQuery.rows[0];

    // Verificar a senha
    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas." }); // Senha incorreta
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Remover senha_hash do objeto do usuário antes de enviar a resposta
    const { senha_hash, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login bem-sucedido!",
      token: token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro interno do servidor ao fazer login." });
  }
};

