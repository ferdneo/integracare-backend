const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'IntegraCare API funcionando!',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'IntegraCare API está funcionando!'
  });
});

app.get('/api/pacientes', (req, res) => {
  res.json({ message: 'Lista de pacientes', data: [] });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;