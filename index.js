require('dotenv').config();
const express = require('express');
const { pool, testConnection } = require('./config/database');
const { createTables } = require('./config/migrations');

const app = express();
app.use(express.json());

// Testar conexão e criar tabelas ao iniciar
const initializeDatabase = async () => {
  await testConnection();
  await createTables();
};

// Rotas principais
app.get('/', (req, res) => {
  res.json({ 
    message: 'IntegraCare API funcionando com PostgreSQL!',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'IntegraCare API está funcionando!',
    database: 'PostgreSQL conectado'
  });
});

// CRUD Pacientes
app.get('/api/pacientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pacientes ORDER BY created_at DESC');
    res.json({ message: 'Lista de pacientes', data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
});

app.post('/api/pacientes', async (req, res) => {
  try {
    const { nome, email, telefone, cpf, data_nascimento, endereco } = req.body;
    const result = await pool.query(
      'INSERT INTO pacientes (nome, email, telefone, cpf, data_nascimento, endereco) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, email, telefone, cpf, data_nascimento, endereco]
    );
    res.status(201).json({ message: 'Paciente criado com sucesso', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar paciente' });
  }
});

// CRUD Médicos
app.get('/api/medicos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medicos ORDER BY created_at DESC');
    res.json({ message: 'Lista de médicos', data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar médicos' });
  }
});

app.post('/api/medicos', async (req, res) => {
  try {
    const { nome, email, crm, especialidade, telefone } = req.body;
    const result = await pool.query(
      'INSERT INTO medicos (nome, email, crm, especialidade, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, email, crm, especialidade, telefone]
    );
    res.status(201).json({ message: 'Médico criado com sucesso', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar médico' });
  }
});

// CRUD Consultas
app.get('/api/consultas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, p.nome as paciente_nome, m.nome as medico_nome 
      FROM consultas c
      LEFT JOIN pacientes p ON c.paciente_id = p.id
      LEFT JOIN medicos m ON c.medico_id = m.id
      ORDER BY c.data_consulta DESC
    `);
    res.json({ message: 'Lista de consultas', data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
});

// Inicializar banco e servidor
const port = process.env.PORT || 3000;

initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Servidor IntegraCare rodando na porta ${port}`);
    console.log('PostgreSQL configurado e tabelas criadas!');
  });
});

module.exports = app;