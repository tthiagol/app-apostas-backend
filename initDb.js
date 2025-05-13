// Arquivo para inicializar o banco de dados SQLite: /home/ubuntu/app_apostas/backend/initDb.js
const fs = require("fs");
const path = require("path");
const db = require("./config/db"); // Nossa configuração adaptada para SQLite

const schemaPath = path.resolve(__dirname, "db_schema_sqlite.sql");
const schemaSql = fs.readFileSync(schemaPath, "utf8");

async function initializeDatabase() {
  console.log("Iniciando a criação das tabelas usando db.exec()...");
  try {
    // Usar db.exec() para executar todo o script SQL de uma vez.
    // db.exec() é adequado para executar múltiplos comandos SQL de um arquivo.
    await new Promise((resolve, reject) => {
      db.db.exec(schemaSql, function(err) {
        if (err) {
          console.error("Erro ao executar o schema SQL com db.exec():", err.message);
          reject(err);
        } else {
          console.log("Schema SQL executado com sucesso. Tabelas e índices criados ou já existentes.");
          resolve();
        }
      });
    });

  } catch (error) {
    // Este catch pode não ser atingido se o reject da Promise não for tratado, mas é bom ter.
    console.error("Erro geral ao inicializar o banco de dados:", error.message);
  } finally {
    // Fechar a conexão com o banco de dados
    if (db.db && typeof db.db.close === 'function') {
      db.db.close((err) => {
        if (err) {
          console.error("Erro ao fechar conexão SQLite:",err.message);
        }
        console.log('Conexão com o banco de dados SQLite fechada.');
      });
    }
  }
}

initializeDatabase();

