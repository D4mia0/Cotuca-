const { query } = require('../db');

async function listar(idUsuario = null) {
  let sql = `
    SELECT 
      r.ID_Reserva, r.Data_Inicial, r.Data_Final, r.Hora_Inicial, r.Hora_Final,
      r.ID_Usuario, u.Nome_Completo, r.Codigo_Recurso, rec.Nome AS Nome_Recurso,
      rec.Tipo_Recurso, r.ID_Status, s.Descricao AS Status
    FROM Reserva r
    INNER JOIN Usuario u ON r.ID_Usuario = u.ID_Usuario
    INNER JOIN Recurso rec ON r.Codigo_Recurso = rec.Codigo_Recurso
    INNER JOIN Status_Reserva s ON r.ID_Status = s.ID_Status
  `;
  const params = {};
  if (idUsuario) {
    sql += ` WHERE r.ID_Usuario = @idUsuario`;
    params.idUsuario = idUsuario;
  }
  sql += ` ORDER BY r.Data_Inicial DESC, r.Hora_Inicial`;

  const result = await query(sql, params);
  return result.recordset;
}

async function existeConflito({ codigoRecurso, dataInicial, horaInicial, horaFinal }) {
  const result = await query(`
    SELECT COUNT(*) AS total
    FROM Reserva
    WHERE Codigo_Recurso = @codigoRecurso
      AND ID_Status IN (2, 4)
      AND Data_Inicial = @dataInicial
      AND Hora_Inicial < @horaFinal AND Hora_Final > @horaInicial
  `, { codigoRecurso, dataInicial, horaInicial, horaFinal });
  return result.recordset[0].total > 0;
}

async function criar(dados) {
  const result = await query(`
    INSERT INTO Reserva (Data_Inicial, Data_Final, Hora_Inicial, Hora_Final, ID_Usuario, Codigo_Recurso, ID_Status)
    OUTPUT INSERTED.*
    VALUES (@dataInicial, @dataFinal, @horaInicial, @horaFinal, @idUsuario, @codigoRecurso, @idStatus)
  `, dados);
  return result.recordset[0];
}

async function atualizarStatus(id, idStatus) {
  const result = await query(`
    UPDATE Reserva
    SET ID_Status = @idStatus
    OUTPUT INSERTED.*
    WHERE ID_Reserva = @id
  `, { id, idStatus });
  return result.recordset[0] || null;
}

module.exports = { listar, existeConflito, criar, atualizarStatus };