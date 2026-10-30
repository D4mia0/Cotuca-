const Reserva = require('../models/Reserva');

async function listar(req, res) {
  try {
    const idUsuario = req.query.idUsuario ? parseInt(req.query.idUsuario) : null;
    const reservas = await Reserva.listar(idUsuario);
    res.json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar reservas' });
  }
}

async function criar(req, res) {
  try {
    const { dataInicial, dataFinal, horaInicial, horaFinal, idUsuario, codigoRecurso, idStatus } = req.body;

    if (!dataInicial || !horaInicial || !horaFinal || !idUsuario || !codigoRecurso) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const conflito = await Reserva.existeConflito({
      codigoRecurso,
      dataInicial,
      horaInicial,
      horaFinal
    });

    if (conflito) {
      return res.status(409).json({ erro: 'Já existe reserva nesse horário para este recurso' });
    }

    const nova = await Reserva.criar({
      dataInicial,
      dataFinal: dataFinal || dataInicial,
      horaInicial,
      horaFinal,
      idUsuario,
      codigoRecurso,
      idStatus: idStatus || 4
    });

    res.status(201).json(nova);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar reserva' });
  }
}

async function atualizarStatus(req, res) {
  try {
    const atualizada = await Reserva.atualizarStatus(parseInt(req.params.id), req.body.idStatus);

    if (!atualizada) {
      return res.status(404).json({ erro: 'Reserva não encontrada' });
    }

    res.json(atualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar reserva' });
  }
}

module.exports = { listar, criar, atualizarStatus };