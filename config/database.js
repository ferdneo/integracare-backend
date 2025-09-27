const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Função para testar conexão
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conectado ao PostgreSQL com sucesso!');
    client.release();
  } catch (err) {
    console.error('Erro ao conectar com PostgreSQL:', err);
  }
};

module.exports = { pool, testConnection };