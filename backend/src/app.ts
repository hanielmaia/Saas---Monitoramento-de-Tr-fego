import express, { Request, Response } from 'express';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Importar rotas
const authRoutes = require('./routes/auth.routes.js');
const devicesRoutes = require('./routes/devices.routes.js');
const logsRoutes = require('./routes/logs.routes.js');
const settingsRoutes = require('./routes/settings.routes.js');
const usersRoutes = require('./routes/users.routes.js');

const app = express();

/**
 * Middleware: Body Parser
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware: CORS
 */
const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:8000')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * Rota de Health Check
 */
app.get('/api/health', (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor está rodando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  });
});

/**
 * Rota de Status (teste)
 */
app.get('/api/status', (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  });
});

/**
 * Registrar Rotas
 */
app.use('/api/auth', authRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', usersRoutes);

export default app;
