const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // O token vem no formato "Bearer <token>" no cabeçalho Authorization
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ mensagem: 'Token ausente. Acesso negado.' });
  }

  try {
    // Tenta verificar o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Injeta o ID do usuário na requisição para ser usado nas rotas
    req.usuarioId = decoded.id; 
    next();
  } catch (err) {
    // Se a verificação falhar (token inválido ou expirado)
    return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
};