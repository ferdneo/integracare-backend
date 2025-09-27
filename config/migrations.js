const { pool } = require('./database');

const createTables = async () => {
  try {
    // Tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('admin', 'medico', 'recepcionista')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de pacientes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        cpf VARCHAR(11) UNIQUE,
        data_nascimento DATE,
        endereco TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de médicos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medicos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        crm VARCHAR(20) UNIQUE NOT NULL,
        especialidade VARCHAR(255),
        telefone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de consultas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS consultas (
        id SERIAL PRIMARY KEY,
        paciente_id INTEGER REFERENCES pacientes(id),
        medico_id INTEGER REFERENCES medicos(id),
        data_consulta TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'agendada' CHECK (status IN ('agendada', 'realizada', 'cancelada')),
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
};

module.exports = { createTables };