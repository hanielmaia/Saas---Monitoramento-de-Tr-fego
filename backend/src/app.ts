import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { swaggerSpec } from './swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Importar rate limiters
const { generalLimiter } = require('./middlewares/rateLimit');

// Importar rotas
const authRoutes = require('./routes/auth.routes.js');
const devicesRoutes = require('./routes/devices.routes.js');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const logsRoutes = require('./routes/logs.routes.js');
const settingsRoutes = require('./routes/settings.routes.js');
const usersRoutes = require('./routes/users.routes.js');

const app = express();

// Ensina o Express a ler a pasta public que estÃ¡ dois nÃ­veis para trÃ¡s
app.use(express.static(path.join(__dirname, '../../public')));

/**
 * Middleware: Body Parser
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware: Cookie Parser
 */
app.use(cookieParser());

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
 * Middleware: Rate Limiting Global
 * Aplicado a todos os endpoints /api
 */
app.use('/api', generalLimiter);

/**
 * Swagger Docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req: Request, res: Response): void => {
  res.json(swaggerSpec);
});

/**
 * Rota de Health Check
 */
app.get('/api/health', (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor estÃ¡ rodando!',
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

// Middlewares de tratamento de rotas e erros devem vir por último
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

