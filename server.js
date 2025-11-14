const app = require('./app');
require('dotenv').config(); // Garante que o .env seja lido

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Rotas de autenticação prontas: /usuarios/registrar e /usuarios/login');
});