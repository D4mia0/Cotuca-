const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.listar);
router.post('/', usuarioController.cadastrar);
router.post('/login', usuarioController.login);

module.exports = router;