/**
 * App Configuration - N Eyes
 * Express application setup with TypeScript
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.routes';
import devicesRoutes from './routes/devices.routes';
import logsRoutes from './routes/logs.routes';
import settingsRoutes from './routes/settings.routes';

// Middleware
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app = express();

/**
 * Middleware de body parsing
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS Configuration - Usando variáveis de ambiente
 */
const corsOrigins: string[] = (
  process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:8000'
).split(',');

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Serve os arquivos estáticos do frontend
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.join(__dirname, '..', '..', 'src');
app.use('/src', express.static(frontendPath));

const pagesPath = path.join(frontendPath, 'pages');
app.use(express.static(pagesPath));

/**
 * Rota raiz → login
 */
app.get('/', (req: Request, res: Response): void => {
  res.sendFile(path.join(pagesPath, 'login.html'));
});

/**
 * Health Check
 */
app.get('/api/health', (req: Request, res: Response): void => {
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

export default app;
