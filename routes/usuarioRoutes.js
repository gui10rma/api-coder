const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware'); // 🚨 Importa o middleware

// Rotas públicas (não precisam de token)
router.post('/registrar', controller.registrar);
router.post('/login', controller.login);

// O authMiddleware verifica o token JWT e injeta req.usuarioId
router.post('/salvar-pontuacao', authMiddleware, controller.salvarPontuacao); 

module.exports = router;