const Reserva = require('../models/reserva');

async function listar(req, res) {
  try {
    const idUsuario = req.query.idUsuario ? parseInt(req.query.idUsuario, 10) : null;
    const reservas = await Reserva.listar(idUsuario);
    res.json(reservas);
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res.status(500).json({ erro: 'Erro interno ao listar reservas' });
  }
}

async function criar(req, res) {
  try {
    const { 
      dataInicial, 
      dataFinal, 
      horaInicial, 
      horaFinal, 
      idUsuario, 
      codigoRecurso, 
      idStatus,
      motivo 
    } = req.body;

    if (!dataInicial || !horaInicial || !horaFinal || !idUsuario || !codigoRecurso || !motivo) {
      return res.status(400).json({ 
        erro: 'Campos obrigatórios faltando. Informe: dataInicial, horaInicial, horaFinal, idUsuario, codigoRecurso e motivo.' 
      });
    }

    const conflito = await Reserva.existeConflito({
      codigoRecurso: parseInt(codigoRecurso, 10),
      dataInicial,
      horaInicial,
      horaFinal
    });

    if (conflito) {
      return res.status(409).json({ erro: 'Já existe reserva cadastrada para este recurso no mesmo horário.' });
    }

    const dataFinalTratada = dataFinal ? dataFinal : dataInicial;
    const statusIdTratado = idStatus ? parseInt(idStatus, 10) : 4;

    const novaReserva = await Reserva.criar({
      dataInicial,
      dataFinal: dataFinalTratada,
      horaInicial,
      horaFinal,
      idUsuario: parseInt(idUsuario, 10),
      codigoRecurso: parseInt(codigoRecurso, 10),
      idStatus: statusIdTratado,
      motivo
    });

    res.status(201).json(novaReserva);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);

    if (error.number === 547) {
      return res.status(400).json({ erro: 'O Usuário ou Recurso informado não existe no banco de dados.' });
    }

    res.status(500).json({ erro: error.message || 'Erro interno ao criar reserva' });
  }
}

async function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { idStatus } = req.body;

    if (!idStatus) {
      return res.status(400).json({ erro: 'O campo idStatus é obrigatório.' });
    }

    const atualizada = await Reserva.atualizarStatus(parseInt(id, 10), parseInt(idStatus, 10));

    if (!atualizada) {
      return res.status(404).json({ erro: 'Reserva não encontrada.' });
    }

    res.json(atualizada);
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({ erro: 'Erro interno ao atualizar reserva' });
  }
}

module.exports = { listar, criar, atualizarStatus };