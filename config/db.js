// Arquivo de configuração do banco de dados: /home/ubuntu/app_apostas/backend/config/db.js (Adaptado para SQLite)
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const DB_NAME = process.env.SQLITE_DB_NAME || "app_apostas.db";
const dbPath = process.env.RENDER_DISK_MOUNT_PATH ? path.join(process.env.RENDER_DISK_MOUNT_PATH, DB_NAME) : path.resolve(__dirname, "..", DB_NAME); // Usa o disco do Render se disponível

// Conecta ou cria o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar/criar banco de dados SQLite:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
    // Habilitar chaves estrangeiras (importante para SQLite)
    db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
      if (pragmaErr) {
        console.error("Erro ao habilitar foreign keys:", pragmaErr.message);
      }
    });
  }
});

// Função para executar queries que retornam múltiplas linhas (SELECT)
const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("Erro na query (all):", sql, params, err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Função para executar queries que retornam uma única linha (SELECT com LIMIT 1)
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error("Erro na query (get):", sql, params, err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Função para executar queries que não retornam resultado (INSERT, UPDATE, DELETE, CREATE)
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) { // Usar function para ter acesso ao this.lastID e this.changes
      if (err) {
        console.error("Erro na query (run):", sql, params, err.message);
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

module.exports = {
  db, // Exporta a instância do DB para controle mais fino, se necessário (ex: fechar conexão)
  all,
  get,
  run
};
