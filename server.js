const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rota de teste para ver se o banco de dados está a responder
app.get('/api/teste', async (req, res) => {
    try {
        await connectToDatabase();
        res.json({ mensagem: "API conectada ao banco com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: "Falha na conexão com o banco de dados." });
    }
});

app.listen(port, () => {
    console.log(`Servidor a correr em http://localhost:${port}`);
});