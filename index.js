require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Dados em memória temporários
let pacientes = [
  { id: 1, nome: "Maria Silva", email: "maria@email.com", telefone: "(11) 99999-1111", cpf: "12345678901", created_at: new Date() },
  { id: 2, nome: "João Santos", email: "joao@email.com", telefone: "(11) 99999-2222", cpf: "12345678902", created_at: new Date() }
];

let medicos = [
  { id: 1, nome: "Dr. Carlos Lima", email: "carlos@email.com", crm: "CRM123456", especialidade: "Cardiologia", telefone: "(11) 99999-3333", created_at: new Date() },
  { id: 2, nome: "Dra. Ana Costa", email: "ana@email.com", crm: "CRM123457", especialidade: "Pediatria", telefone: "(11) 99999-4444", created_at: new Date() }
];

let consultas = [
  { id: 1, paciente_id: 1, medico_id: 1, data_consulta: new Date(), status: 'agendada', paciente_nome: 'Maria Silva', medico_nome: 'Dr. Carlos Lima', created_at: new Date() }
];

// Rotas principais
app.get('/', (req, res) => {
  res.json({ 
    message: 'IntegraCare API funcionando com dados em memória!',
    status: 'online',
    timestamp: new Date().toISOString(),
    mode: 'in-memory'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'IntegraCare API está funcionando!',
    database: 'Dados em memória (temporário)'
  });
});

// CRUD Pacientes
app.get('/api/pacientes', (req, res) => {
  res.json({ message: 'Lista de pacientes', data: pacientes });
});

app.post('/api/pacientes', (req, res) => {
  const { nome, email, telefone, cpf, data_nascimento, endereco } = req.body;
  const newId = Math.max(...pacientes.map(p => p.id)) + 1;
  const novoPaciente = { 
    id: newId, 
    nome, 
    email, 
    telefone, 
    cpf, 
    data_nascimento, 
    endereco,
    created_at: new Date() 
  };
  pacientes.push(novoPaciente);
  res.status(201).json({ message: 'Paciente criado com sucesso', data: novoPaciente });
});

// CRUD Médicos
app.get('/api/medicos', (req, res) => {
  res.json({ message: 'Lista de médicos', data: medicos });
});

app.post('/api/medicos', (req, res) => {
  const { nome, email, crm, especialidade, telefone } = req.body;
  const newId = Math.max(...medicos.map(m => m.id)) + 1;
  const novoMedico = { 
    id: newId, 
    nome, 
    email, 
    crm, 
    especialidade, 
    telefone,
    created_at: new Date() 
  };
  medicos.push(novoMedico);
  res.status(201).json({ message: 'Médico criado com sucesso', data: novoMedico });
});

// CRUD Consultas
app.get('/api/consultas', (req, res) => {
  res.json({ message: 'Lista de consultas', data: consultas });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor IntegraCare rodando na porta ${port}`);
  console.log('Modo: Dados em memória');
});

module.exports = app;