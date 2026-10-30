const { query } = require('../db');

async function criar(usuario) {
  const result = await query(`
    INSERT INTO Usuario (CPF, Nome_Completo, Data_Aniversario, Celular, Email, Login_Usuario, Senha)
    OUTPUT INSERTED.ID_Usuario, INSERTED.Nome_Completo, INSERTED.Email
    VALUES (@cpf, @nomeCompleto, @dataAniversario, @celular, @email, @loginUsuario, @senha)
  `, usuario);
  return result.recordset[0];
}

async function buscarPorEmailESenha(email, senha) {
  const result = await query(`
    SELECT ID_Usuario, Nome_Completo, Email, Login_Usuario
    FROM Usuario
    WHERE Email = @email AND Senha = @senha
  `, { email, senha });
  return result.recordset[0] || null;
}

async function registrarAcesso(idUsuario) {
  await query(`INSERT INTO Auditoria_Acesso (ID_Usuario) VALUES (@idUsuario)`, { idUsuario });
  await query(`UPDATE Usuario SET Data_Ultimo_Acesso = GETDATE() WHERE ID_Usuario = @idUsuario`, { idUsuario });
}

module.exports = { criar, buscarPorEmailESenha, registrarAcesso };