const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Leitura do .env deve ocorrer no server.js ou antes
require('dotenv').config();

// 1) Conexão com o Mongo
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado!'))
    .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// 2) Middlewares globais
app.use(cors());
app.use(express.json()); // Habilita o Express a ler JSON no corpo da requisição

// 3) Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/usuarios', usuarioRoutes);

module.exports = app;