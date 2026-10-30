const express = require('express');
const router = express.Router();
const recursoController = require('../controllers/recursoController');

router.get('/', recursoController.listar);
router.post('/', recursoController.criar);

module.exports = router;