const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false
});

// Função para testar conexão com retry
const testConnection = async () => {
  let retries = 3;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log('✅ Conectado ao PostgreSQL com sucesso!');
      client.release();
      return true;
    } catch (err) {
      console.error(`❌ Erro ao conectar (tentativa ${4-retries}/3):`, err.message);
      retries--;
      if (retries > 0) {
        console.log('🔄 Tentando novamente em 2 segundos...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  return false;
};

module.exports = { pool, testConnection };