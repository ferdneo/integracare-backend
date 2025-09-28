require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Configuração CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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


// PUT - Atualizar paciente
app.put('/api/pacientes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, telefone, cpf, data_nascimento, endereco } = req.body;
  
  const index = pacientes.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Paciente não encontrado' });
  }
  
  pacientes[index] = { ...pacientes[index], nome, email, telefone, cpf, data_nascimento, endereco };
  res.json({ message: 'Paciente atualizado com sucesso', data: pacientes[index] });
});

// DELETE - Excluir paciente
app.delete('/api/pacientes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = pacientes.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Paciente não encontrado' });
  }
  
  const deleted = pacientes.splice(index, 1);
  res.json({ message: 'Paciente excluído com sucesso', data: deleted[0] });
});

// PUT - Atualizar médico
app.put('/api/medicos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, crm, especialidade, telefone } = req.body;
  
  const index = medicos.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Médico não encontrado' });
  }
  
  medicos[index] = { ...medicos[index], nome, email, crm, especialidade, telefone };
  res.json({ message: 'Médico atualizado com sucesso', data: medicos[index] });
});

// DELETE - Excluir médico
app.delete('/api/medicos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = medicos.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Médico não encontrado' });
  }
  
  const deleted = medicos.splice(index, 1);
  res.json({ message: 'Médico excluído com sucesso', data: deleted[0] });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor IntegraCare rodando na porta ${port}`);
  console.log('Modo: Dados em memória');
});

module.exports = app;