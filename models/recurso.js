const { query } = require('../db');

async function criar(recurso) {
  const { tipoRecurso, nome, capacidade, localizacao, equipamentos, idStatus, idUsuario } = recurso;

  const result = await query(`
    INSERT INTO Recurso (Tipo_Recurso, Nome, Capacidade, Localizacao, Equipamentos, ID_Status, ID_Usuario)
    OUTPUT INSERTED.*
    VALUES (@tipoRecurso, @nome, @capacidade, @localizacao, @equipamentos, @idStatus, @idUsuario)
  `, { 
    tipoRecurso, 
    nome, 
    capacidade: parseInt(capacidade, 10), 
    localizacao, 
    equipamentos: equipamentos ? equipamentos : '',
    idStatus: parseInt(idStatus, 10),
    idUsuario: parseInt(idUsuario, 10)
  });

  return result.recordset[0];
}

async function buscarTodos() {
  const result = await query(`
    SELECT 
      rec.Codigo_Recurso, 
      rec.Tipo_Recurso, 
      rec.Nome, 
      rec.Capacidade, 
      rec.Localizacao, 
      rec.Equipamentos, 
      rec.ID_Status,
      rec.ID_Usuario,
      st.Descricao AS Status
    FROM Recurso rec
    INNER JOIN Status_Reserva st ON rec.ID_Status = st.ID_Status
  `);
  return result.recordset;
}

async function atualizarStatus(codigoRecurso, idStatus) {
  const result = await query(`
    UPDATE Recurso
    SET ID_Status = @idStatus
    OUTPUT INSERTED.*
    WHERE Codigo_Recurso = @codigoRecurso
  `, { 
    codigoRecurso: parseInt(codigoRecurso, 10), 
    idStatus: parseInt(idStatus, 10) 
  });
  
  return result.recordset[0] || null;
}

module.exports = { criar, buscarTodos, atualizarStatus };