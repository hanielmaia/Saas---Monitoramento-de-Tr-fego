/**
 * App Configuration - N Eyes
 * Express application setup
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth.routes');
const devicesRoutes = require('./routes/devices.routes');
const logsRoutes = require('./routes/logs.routes');
const settingsRoutes = require('./routes/settings.routes');

// Middleware
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

/**
 * Middleware de body parsing
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS Configuration
 */
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:8000').split(',');
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Serve os arquivos estáticos do frontend
 */
const frontendPath = path.join(__dirname, '..', '..', 'src');
app.use('/src', express.static(frontendPath));

const pagesPath = path.join(frontendPath, 'pages');
app.use(express.static(pagesPath));

/**
 * Rota raiz → login
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(pagesPath, 'login.html'));
});

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend do N Eyes rodando',
    timestamp: new Date().toISOString()
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/settings', settingsRoutes);

/**
 * 404 Handler - deve ficar antes do error handler
 */
app.use(notFoundHandler);

/**
 * Error Handler - deve ser o último middleware
 */
app.use(errorHandler);

module.exports = app;
