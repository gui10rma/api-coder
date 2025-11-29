const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware'); 

// Rotas públicas
router.post('/registrar', controller.registrar);
router.post('/login', controller.login);

// Rota protegida para salvar a pontuação
router.post('/salvar-pontuacao', authMiddleware, controller.salvarPontuacao);

// ✅ NOVO: Rota protegida para buscar as pontuações do usuário
router.get('/pontuacoes', authMiddleware, controller.buscarPontuacoes); // <--- ADICIONE ESTA LINHA

module.exports = router;