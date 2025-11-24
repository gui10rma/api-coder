const mongoose = require('mongoose');


const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senhaHash: { type: String, required: true },
    
    
    pontuacaoTotal: { type: Number, default: 0 }
});

module.exports = mongoose.model('Usuario', usuarioSchema);