const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const settingsRoutes = require('./routes/settings.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos do frontend
const frontendPath = path.join(__dirname, '..', '..', 'src');
app.use('/src', express.static(frontendPath));

// Rota raiz → login
const pagesPath = path.join(frontendPath, 'pages');
app.use(express.static(pagesPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(pagesPath, 'login.html'));
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend do N Eyes rodando'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/settings', settingsRoutes);

module.exports = app;
