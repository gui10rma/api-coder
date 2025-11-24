const mongoose = require('mongoose');


const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senhaHash: { type: String, required: true },
    missoes: { type: Map, of: Number, default: {} } 
});

module.exports = mongoose.model('Usuario', usuarioSchema);