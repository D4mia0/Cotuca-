const Usuario = require('../models/usuario');

// controllers/usuarioController.js
async function cadastrar(req, res) {
  try {
    const { 
      cpf, 
      nomeCompleto, 
      dataAniversario, 
      celular, 
      email, 
      loginUsuario, 
      senha,
      eProfessor 
    } = req.body;

    if (!cpf || !nomeCompleto || !email || !loginUsuario || !senha || eProfessor === undefined) {
      return res.status(400).json({ 
        erro: 'Campos obrigatórios faltando. Envie: cpf, nomeCompleto, email, loginUsuario, senha e eProfessor.' 
      });
    }

    const novoUsuario = await Usuario.criar({
      cpf,
      nomeCompleto,
      dataAniversario: dataAniversario ? dataAniversario : null, // Garante NULL em vez de ""
      celular: celular || '',
      email,
      loginUsuario,
      senha,
      eProfessor: parseInt(eProfessor, 10)
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro detalhado no SQL Server:', error); // Exibe o erro completo no terminal do VS Code

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({ erro: 'CPF, Email ou Login já cadastrado.' });
    }

    // Exibe a mensagem de erro original do banco
    res.status(500).json({ erro: error.message || 'Erro interno ao salvar no banco' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe email e senha.' });
    }

    const usuario = await Usuario.buscarPorEmailESenha(email, senha);

    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    await Usuario.registrarAcesso(usuario.ID_Usuario);

    // Retorna o usuário com a propriedade E_Professor inclusa pelo model
    res.json(usuario);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro ao autenticar usuário' });
  }
}

async function listar(req, res) {
  try {
    // Retorna a lista contendo E_Professor em cada item
    const usuarios = await Usuario.buscarTodos();
    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
}

module.exports = { cadastrar, login, listar };