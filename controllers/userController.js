// Arquivo de controllers de usuário: /home/ubuntu/app_apostas/backend/controllers/userController.js
const db = require("../config/db");

// Obter perfil do usuário logado
exports.getUserProfile = async (req, res) => {
  try {
    // O ID do usuário é adicionado ao req pelo authMiddleware
    const userId = req.user.id;
    const userQuery = await db.query("SELECT id, nome_usuario, email, data_cadastro FROM usuarios WHERE id = $1", [userId]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json(userQuery.rows[0]);
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor ao obter perfil." });
  }
};

// Atualizar perfil do usuário logado
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nome_usuario } = req.body; // Permitir apenas atualização do nome_usuario por enquanto

    if (!nome_usuario) {
        return res.status(400).json({ message: "Nome de usuário é obrigatório para atualização." });
    }

    const updateUserQuery = "UPDATE usuarios SET nome_usuario = $1, data_atualizacao = NOW() WHERE id = $2 RETURNING id, nome_usuario, email, data_cadastro, data_atualizacao";
    const updatedUser = await db.query(updateUserQuery, [nome_usuario, userId]);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado para atualização." });
    }

    res.status(200).json({
        message: "Perfil atualizado com sucesso!",
        user: updatedUser.rows[0]
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor ao atualizar perfil." });
  }
};

// Obter preferências do usuário logado
exports.getUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const preferencesQuery = await db.query("SELECT * FROM preferencias_usuario WHERE id_usuario = $1", [userId]);

    if (preferencesQuery.rows.length === 0) {
      // Se não houver preferências, pode retornar um objeto vazio ou um default
      return res.status(200).json({ 
        message: "Nenhuma preferência encontrada, retornando defaults.",
        preferences: {
            id_usuario: userId,
            times_favoritos: [],
            ligas_interesse: [],
            notificacao_jogos_dia: true,
            notificacao_alertas_escalacao: true,
            notificacao_noticias_importantes: true
        }
      });
    }

    res.status(200).json(preferencesQuery.rows[0]);
  } catch (error) {
    console.error("Erro ao obter preferências do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor ao obter preferências." });
  }
};

// Salvar/Atualizar preferências do usuário logado
exports.saveUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
        times_favoritos, 
        ligas_interesse, 
        notificacao_jogos_dia, 
        notificacao_alertas_escalacao, 
        notificacao_noticias_importantes 
    } = req.body;

    // Validação básica (pode ser mais robusta)
    if (times_favoritos === undefined || ligas_interesse === undefined) {
        return res.status(400).json({ message: "Times favoritos e ligas de interesse são obrigatórios." });
    }

    // Verificar se já existem preferências para este usuário
    const existingPreferences = await db.query("SELECT id FROM preferencias_usuario WHERE id_usuario = $1", [userId]);

    let savedPreferences;
    if (existingPreferences.rows.length > 0) {
      // Atualizar preferências existentes
      const preferenceId = existingPreferences.rows[0].id;
      const updateQuery = `
        UPDATE preferencias_usuario 
        SET times_favoritos = $1, ligas_interesse = $2, notificacao_jogos_dia = $3, 
            notificacao_alertas_escalacao = $4, notificacao_noticias_importantes = $5, data_atualizacao = NOW()
        WHERE id = $6 RETURNING *`;
      savedPreferences = await db.query(updateQuery, [
        times_favoritos || [], 
        ligas_interesse || [], 
        notificacao_jogos_dia !== undefined ? notificacao_jogos_dia : true, 
        notificacao_alertas_escalacao !== undefined ? notificacao_alertas_escalacao : true, 
        notificacao_noticias_importantes !== undefined ? notificacao_noticias_importantes : true,
        preferenceId
      ]);
    } else {
      // Inserir novas preferências
      const insertQuery = `
        INSERT INTO preferencias_usuario (id_usuario, times_favoritos, ligas_interesse, notificacao_jogos_dia, notificacao_alertas_escalacao, notificacao_noticias_importantes) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      savedPreferences = await db.query(insertQuery, [
        userId, 
        times_favoritos || [], 
        ligas_interesse || [], 
        notificacao_jogos_dia !== undefined ? notificacao_jogos_dia : true, 
        notificacao_alertas_escalacao !== undefined ? notificacao_alertas_escalacao : true, 
        notificacao_noticias_importantes !== undefined ? notificacao_noticias_importantes : true
      ]);
    }

    res.status(200).json({
      message: "Preferências salvas com sucesso!",
      preferences: savedPreferences.rows[0]
    });

  } catch (error) {
    console.error("Erro ao salvar preferências do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor ao salvar preferências." });
  }
};

