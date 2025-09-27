require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testDatabase() {
  try {
    console.log('Testando conexão...');
    const client = await pool.connect();
    console.log('Conectado! Testando query...');
    
    const result = await client.query('SELECT NOW()');
    console.log('Query funcionou:', result.rows[0]);
    
    client.release();
    console.log('Teste concluído com sucesso!');
  } catch (error) {
    console.error('Erro no teste:', error);
  }
  process.exit();
}

testDatabase();