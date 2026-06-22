import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Importar rotas
const authRoutes = require('./routes/auth.routes.js');
const devicesRoutes = require('./routes/devices.routes.js');
const logsRoutes = require('./routes/logs.routes.js');
const settingsRoutes = require('./routes/settings.routes.js');
const usersRoutes = require('./routes/users.routes.js');

const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler.js');
const logger = require('./utils/logger.cjs');

const app = express();

/**
 * Segurança e hardening
 */
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Muitas requisições. Tente novamente mais tarde.'
  }
});

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.originalUrl, ip: req.ip }, 'Incoming request');
  next();
});

app.use(apiLimiter);
app.use(xssClean());
app.use(mongoSanitize());

/**
 * Middleware: Body Parser
 */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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

/**
 * Final handlers
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
