const Recurso = require('../models/recurso');

async function cadastrar(req, res) {
  try {
    const { tipoRecurso, nome, capacidade, localizacao, equipamentos, idStatus, idUsuario } = req.body;

    // Validação estrita de todos os campos obrigatórios
    if (!tipoRecurso || !nome || !capacidade || !localizacao || !idUsuario) {
      return res.status(400).json({ 
        erro: 'Campos obrigatórios faltando: tipoRecurso, nome, capacidade, localizacao e idUsuario.' 
      });
    }

    const statusIdTratado = idStatus ? parseInt(idStatus, 10) : 1;
    const equipamentosTratados = equipamentos ? equipamentos : '';

    const novoRecurso = await Recurso.criar({
      tipoRecurso,
      nome,
      capacidade: parseInt(capacidade, 10),
      localizacao,
      equipamentos: equipamentosTratados,
      idStatus: statusIdTratado,
      idUsuario: parseInt(idUsuario, 10),
    });

    res.status(201).json(novoRecurso);
  } catch (error) {
    console.error('Erro ao cadastrar recurso:', error);
    res.status(500).json({ erro: 'Erro ao inserir recurso no banco de dados' });
  }
}

async function listar(req, res) {
  try {
    const recursos = await Recurso.buscarTodos();
    res.json(recursos);
  } catch (error) {
    console.error('Erro ao listar recursos:', error);
    res.status(500).json({ erro: 'Erro ao buscar recursos do banco' });
  }
}

async function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { idStatus } = req.body;

    if (!idStatus) {
      return res.status(400).json({ erro: 'O campo idStatus é obrigatório.' });
    }

    const recursoAtualizado = await Recurso.atualizarStatus(
      parseInt(id, 10), 
      parseInt(idStatus, 10)
    );

    if (!recursoAtualizado) {
      return res.status(404).json({ erro: 'Recurso não encontrado.' });
    }

    res.json(recursoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar status do recurso:', error);
    res.status(500).json({ erro: 'Erro ao atualizar status do recurso' });
  }
}

module.exports = { cadastrar, listar, atualizarStatus };