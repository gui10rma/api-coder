const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
// 🚨 CORREÇÃO: Altera o caminho para 'middleware' (singular) e garante a ausência de /src
const authMiddleware = require('../middleware/authMiddleware');

// Rotas públicas (não precisam de token)
router.post('/registrar', controller.registrar);
router.post('/login', controller.login);

// ✅ Rota protegida para salvar a pontuação
// O authMiddleware verifica o token JWT e injeta req.usuarioId
router.post('/salvar-pontuacao', authMiddleware, controller.salvarPontuacao);

module.exports = router;