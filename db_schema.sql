-- Arquivo de schema do banco de dados: /home/ubuntu/app_apostas/backend/db_schema.sql

-- Extensão para UUID, se não existir (opcional, mas bom para IDs únicos)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Usando gen_random_uuid() do pgcrypto que geralmente vem habilitado
    nome_usuario VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Preferências do Usuário (Exemplo inicial)
-- Pode ser expandida para armazenar preferências mais granulares
CREATE TABLE IF NOT EXISTS preferencias_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    -- Exemplo: Armazenar IDs de times e ligas favoritas como arrays de texto ou JSONB
    times_favoritos TEXT[],          -- Array de IDs ou nomes de times
    ligas_interesse TEXT[],          -- Array de IDs ou nomes de ligas
    notificacao_jogos_dia BOOLEAN DEFAULT TRUE,
    notificacao_alertas_escalacao BOOLEAN DEFAULT TRUE,
    notificacao_noticias_importantes BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_preferencias_id_usuario ON preferencias_usuario(id_usuario);

-- Trigger para atualizar data_atualizacao na tabela usuarios
CREATE OR REPLACE FUNCTION trigger_set_timestamp_usuarios()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp_usuarios();

-- Trigger para atualizar data_atualizacao na tabela preferencias_usuario
CREATE OR REPLACE FUNCTION trigger_set_timestamp_preferencias()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_preferencias
BEFORE UPDATE ON preferencias_usuario
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp_preferencias();

-- Adicionar comentários às tabelas e colunas pode ser útil
COMMENT ON TABLE usuarios IS 'Armazena informações dos usuários do aplicativo.';
COMMENT ON COLUMN usuarios.id IS 'Identificador único do usuário (UUID).';
COMMENT ON COLUMN usuarios.email IS 'Email único do usuário, usado para login.';

COMMENT ON TABLE preferencias_usuario IS 'Armazena as preferências personalizadas de cada usuário.';
COMMENT ON COLUMN preferencias_usuario.id_usuario IS 'Chave estrangeira referenciando o ID do usuário na tabela usuarios.';


