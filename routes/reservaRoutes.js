const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get('/', reservaController.listar);
router.post('/', reservaController.criar);
router.patch('/:id', reservaController.atualizarStatus);

module.exports = router;