// Inicializar banco e servidor com tratamento de erro
const startServer = async () => {
  try {
    const connected = await testConnection();
    if (connected) {
      await createTables();
      console.log('✅ Sistema inicializado com sucesso!');
    } else {
      console.log('⚠️ Servidor iniciando sem conexão com banco (modo degradado)');
    }
  } catch (error) {
    console.error('❌ Erro na inicialização:', error.message);
    console.log('⚠️ Servidor iniciando em modo degradado');
  }
  
  app.listen(port, () => {
    console.log(`🚀 Servidor IntegraCare rodando na porta ${port}`);
  });
};

startServer();