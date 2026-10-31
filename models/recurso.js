const { query } = require('../db');

async function buscarTodos() {
  const result = await query('SELECT Codigo_Recurso, Tipo_Recurso, Nome, Capacidade, Localizacao FROM Recurso');
  return result.recordset;
}

async function criar(dados) {
  const { nome, capacidade, bloco, equipamentos, tipo } = dados;

  // Como a tabela não possui a coluna Equipamentos, juntamos as informações dentro de Localizacao
  const localizacaoCompleta = equipamentos ? `${bloco} - ${equipamentos}` : bloco;

  const result = await query(`
    INSERT INTO Recurso (Tipo_Recurso, Nome, Capacidade, Localizacao)
    OUTPUT INSERTED.Codigo_Recurso, INSERTED.Nome, INSERTED.Tipo_Recurso, INSERTED.Capacidade, INSERTED.Localizacao
    VALUES (@tipo, @nome, @capacidade, @localizacao)
  `, {
    tipo: tipo || 'Laboratorio',
    nome: nome,
    capacidade: parseInt(capacidade, 10),
    localizacao: localizacaoCompleta
  });

  return result.recordset[0];
}

module.exports = { buscarTodos, criar };