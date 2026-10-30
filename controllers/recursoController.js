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

async function criar(req, res) {
  try {
    const { tipoRecurso, nome, capacidade, localizacao } = req.body;

    if (!tipoRecurso || !nome || !capacidade || !localizacao) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const novo = await Recurso.criar({
      tipoRecurso,
      nome,
      capacidade: parseInt(capacidade),
      localizacao
    });

    res.status(201).json(novo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar recurso' });
  }
}

module.exports = { listar, criar };