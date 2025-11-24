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
        // O campo pontuacaoTotal será inicializado como 0 (default: 0)
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

        res.json({ token, nome: usuario.nome, pontuacaoTotal: usuario.pontuacaoTotal }); // ✅ RETORNA NOME E PONTUAÇÃO
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao autenticar.', detalhe: err.message });
    }
};

// --- NOVO ENDPOINT: SALVAR PONTUAÇÃO ---
exports.salvarPontuacao = async (req, res) => {
    // req.usuarioId é injetado pelo authMiddleware
    const usuarioId = req.usuarioId;
    const { score } = req.body; // Score é a pontuação da sessão (Ex: 850 pontos)

    if (typeof score !== 'number' || score <= 0) {
        return res.status(400).json({ mensagem: 'Pontuação inválida.' });
    }

    try {
        // Usa $inc (increment) e $max (máximo) para atualizar a pontuação
        // Se a pontuação da sessão for maior que a pontuação máxima já salva (se você tivesse um campo maxScore), 
        // ou simplesmente adiciona ao total. Aqui vamos apenas adicionar ao total.
        const usuarioAtualizado = await Usuario.findByIdAndUpdate(
            usuarioId,
            { $inc: { pontuacaoTotal: score } }, // ➕ Incrementa a pontuação total
            { new: true } // Retorna o documento atualizado
        );

        if (!usuarioAtualizado) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        res.json({ 
            mensagem: 'Pontuação salva com sucesso.',
            pontuacaoTotal: usuarioAtualizado.pontuacaoTotal 
        });

    } catch (err) {
        console.error('Erro ao salvar pontuação:', err);
        res.status(500).json({ mensagem: 'Erro interno ao salvar pontuação.', detalhe: err.message });
    }
};