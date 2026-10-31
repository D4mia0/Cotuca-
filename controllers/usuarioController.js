const Usuario = require('../models/usuario');

async function listar(req, res) {
  try {
    const usuarios = await Usuario.buscarTodos();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
}

async function cadastrar(req, res) {
  try {
    const { cpf, nomeCompleto, dataAniversario, celular, email, loginUsuario, senha } = req.body;

    if (!cpf || !nomeCompleto || !email || !loginUsuario || !senha) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const novo = await Usuario.criar({
      cpf,
      nomeCompleto,
      dataAniversario: dataAniversario || null,
      celular: celular || '',
      email,
      loginUsuario,
      senha
    });

    res.status(201).json(novo);
  } catch (error) {
    console.error(error);
    if (error.number === 2627) {
      return res.status(409).json({ erro: 'CPF, Email ou Login já cadastrado' });
    }
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.buscarPorEmailESenha(email, senha);

    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    await Usuario.registrarAcesso(usuario.ID_Usuario);
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro no login' });
  }
}

module.exports = { cadastrar, login, listar };