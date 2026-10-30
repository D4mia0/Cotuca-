const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db');

const usuarioRoutes = require('./routes/usuarioRoutes');
const recursoRoutes = require('./routes/recursoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/teste', async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ mensagem: 'API conectada ao banco com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Falha na conexão com o banco de dados.' });
  }
});

// Rotas organizadas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/reservas', reservaRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});