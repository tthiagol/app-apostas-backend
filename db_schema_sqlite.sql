-- Arquivo de schema do banco de dados: /home/ubuntu/app_apostas/backend/db_schema_sqlite.sql

-- Tabela de Usuários (Adaptada para SQLite)
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_usuario TEXT,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Preferências do Usuário (Adaptada para SQLite)
CREATE TABLE IF NOT EXISTS preferencias_usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    times_favoritos TEXT,          -- Armazenar como JSON stringificado
    ligas_interesse TEXT,          -- Armazenar como JSON stringificado
    notificacao_jogos_dia INTEGER DEFAULT 1, -- BOOLEAN (0 ou 1)
    notificacao_alertas_escalacao INTEGER DEFAULT 1, -- BOOLEAN (0 ou 1)
    notificacao_noticias_importantes INTEGER DEFAULT 1, -- BOOLEAN (0 ou 1)
    data_criacao TEXT DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_preferencias_id_usuario ON preferencias_usuario(id_usuario);

-- Triggers para data_atualizacao (SQLite) - Opcional, pode ser feito na aplicação
-- Se for usar triggers, a sintaxe é um pouco diferente:
/*
CREATE TRIGGER IF NOT EXISTS update_usuarios_data_atualizacao
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    UPDATE usuarios SET data_atualizacao = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS update_preferencias_data_atualizacao
AFTER UPDATE ON preferencias_usuario
FOR EACH ROW
BEGIN
    UPDATE preferencias_usuario SET data_atualizacao = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
*/

-- Comentários (não são executados, apenas para documentação)
-- COMMENT ON TABLE usuarios IS 'Armazena informações dos usuários do aplicativo.';
-- COMMENT ON COLUMN usuarios.id IS 'Identificador único do usuário (INTEGER).';
-- COMMENT ON COLUMN usuarios.email IS 'Email único do usuário, usado para login.';

-- COMMENT ON TABLE preferencias_usuario IS 'Armazena as preferências personalizadas de cada usuário.';
-- COMMENT ON COLUMN preferencias_usuario.id_usuario IS 'Chave estrangeira referenciando o ID do usuário na tabela usuarios.';
-- COMMENT ON COLUMN preferencias_usuario.times_favoritos IS 'JSON stringificado dos times favoritos.';
-- COMMENT ON COLUMN preferencias_usuario.ligas_interesse IS 'JSON stringificado das ligas de interesse.';

