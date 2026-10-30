const { query } = require('../db');

async function listar() {
  const result = await query(`
    SELECT Codigo_Recurso, Tipo_Recurso, Nome, Capacidade, Localizacao
    FROM Recurso
    ORDER BY Tipo_Recurso, Nome
  `);
  return result.recordset;
}

async function criar(recurso) {
  const result = await query(`
    INSERT INTO Recurso (Tipo_Recurso, Nome, Capacidade, Localizacao)
    OUTPUT INSERTED.*
    VALUES (@tipoRecurso, @nome, @capacidade, @localizacao)
  `, recurso);
  return result.recordset[0];
}

module.exports = { listar, criar };