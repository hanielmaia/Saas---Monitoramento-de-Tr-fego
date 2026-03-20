require('dotenv').config();

// Garante que DATABASE_URL está disponível para o Prisma Client
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:neyes2026@localhost:5432/n_eyes_db';
}

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});