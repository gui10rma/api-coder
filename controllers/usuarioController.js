const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTRO ---
exports.registrar = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        // 1. Cria o hash da senha (salt de 10)
        const senhaHash = bcrypt.hashSync(senha, 10);

        // 2. Cria e salva o novo usuário no MongoDB
        const usuario = new Usuario({ nome, email, senhaHash });
        await usuario.save();

        res.status(201).json({ mensagem: 'Usuário criado com sucesso.' });
    } catch (err) {
        // Trata erro de email duplicado (MongoDB erro code 11000)
        if (err.code === 11000) {
            return res.status(409).json({ mensagem: 'Email já cadastrado.' });
        }
        res.status(500).json({ mensagem: 'Erro ao registrar.', detalhe: err.message });
    }
};

// --- LOGIN ---
exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        // 1. Encontra o usuário pelo email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha fornecida com o hash salvo
        const senhaValida = bcrypt.compareSync(senha, usuario.senhaHash);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
        }

        // 3. Gera o Token JWT
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expira em 1 dia
        );

        res.json({ token });
    } catch (err) {
        // Geralmente ocorre se JWT_SECRET estiver ausente na Render
        res.status(500).json({ mensagem: 'Erro ao autenticar.', detalhe: err.message });
    }
};

// --- NOVA ROTA: SALVAR PONTUAÇÃO (UPSERT) ---
exports.salvarPontuacao = async (req, res) => {
    const usuarioId = req.usuarioId; // Obtido do token via authMiddleware
    const { nomeMissao, novaPontuacao } = req.body; // Ex: nomeMissao='Missao1', novaPontuacao=100

    if (!nomeMissao || typeof novaPontuacao !== 'number') {
        return res.status(400).json({ mensagem: 'Dados da missão inválidos.' });
    }

    try {
        // NOVO CÓDIGO: Usa $set para ATUALIZAR/SUBSTITUIR a pontuação.
        // O ponto crucial é 'missoes.' + nomeMissao (para acessar o mapa)
        const update = {
            $set: {
                [`missoes.${nomeMissao}`]: novaPontuacao // Substitui o valor.
            }
        };

        const usuarioAtualizado = await Usuario.findByIdAndUpdate(
            usuarioId,
            update,
            { new: true, runValidators: true }
        );

        if (!usuarioAtualizado) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        res.json({ 
            mensagem: 'Pontuação da missão atualizada com sucesso!',
            pontuacoes: usuarioAtualizado.missoes 
        });

    } catch (err) {
        console.error('Erro ao salvar pontuação:', err);
        res.status(500).json({ mensagem: 'Erro interno ao salvar pontuação.' });
    }
};