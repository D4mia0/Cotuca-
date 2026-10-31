const Recurso = require('../models/Recurso');

async function listar(req, res) {
  try {
    const recursos = await Recurso.listar();
    res.json(recursos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar recursos' });
  }
}

async function cadastrar(req, res) {
  try {
    // Aceita tanto nomes em minúsculas como com inicial maiúscula
    const nome = req.body.nome || req.body.Nome;
    const capacidade = req.body.capacidade || req.body.Capacidade;
    const bloco = req.body.bloco || req.body.Bloco || req.body.localizacao || req.body.Localizacao;

    if (!nome || !capacidade || !bloco) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const novoRecurso = await Recurso.criar({
      nome,
      capacidade,
      bloco,
      equipamentos: req.body.equipamentos || '',
      tipo: req.body.tipo || 'Laboratorio',
      status: req.body.status || 'Disponível'
    });

    res.status(201).json(novoRecurso);
  } catch (error) {
    console.error('Erro ao cadastrar recurso:', error);
    res.status(500).json({ erro: 'Erro ao inserir recurso no banco de dados' });
  }
}

module.exports = { listar, cadastrar };