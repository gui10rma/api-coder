const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware de autenticação

// Rotas públicas (não precisam de token)
router.post('/registrar', controller.registrar);
router.post('/login', controller.login);

// NOVA ROTA: Rota protegida para salvar a pontuação do usuário
router.post('/salvar-pontuacao', authMiddleware, controller.salvarPontuacao);

module.exports = router;