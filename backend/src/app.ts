<<<<<<< HEAD
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
=======
﻿import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
>>>>>>> main
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

const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler.js');
const logger = require('./utils/logger.cjs');
const swaggerUiDist = require('swagger-ui-dist');
const swaggerSpec = require('./utils/swaggerConfig.js');

// --- Funções de Sanitização ---
function deepSanitizeObject(target: any) {
  if (Array.isArray(target)) {
    target.forEach(deepSanitizeObject);
    return;
  }

  if (target && typeof target === 'object') {
    Object.keys(target).forEach((key) => {
      const value = target[key];
      const sanitizedKey = key.replace(/^\$|\./g, '');

      if (sanitizedKey !== key) {
        target[sanitizedKey] = value;
        delete target[key];
      }

      if (value && typeof value === 'object') {
        deepSanitizeObject(value);
      }
    });
  }
}

function requestSanitizer(req: Request, res: Response, next: NextFunction) {
  const keys = ['body', 'params'] as const;
  keys.forEach((key) => {
    const target = req[key];
    if (target && typeof target === 'object') {
      deepSanitizeObject(target);
    }
  });
  next();
}
// ------------------------------

const app = express();

// Ensina o Express a ler a pasta public que estÃ¡ dois nÃ­veis para trÃ¡s
app.use(express.static(path.join(__dirname, '../../public')));

/**
 * Segurança e hardening (Com liberação para o Swagger UI rodar)
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "validator.swagger.io"],
    },
  },
}));

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

/**
 * Middleware: Body Parser & Sanitização
 */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(requestSanitizer);

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
 * Swagger UI
 */
const swaggerAssetsPath = swaggerUiDist.getAbsoluteFSPath();
app.use('/api/docs/assets', express.static(swaggerAssetsPath));
app.get('/api/docs', (req: Request, res: Response): void => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Docs - N Eyes</title>
  <link rel="stylesheet" type="text/css" href="/api/docs/assets/swagger-ui.css" />
  <style>body { margin: 0; padding: 0; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/api/docs/assets/swagger-ui-bundle.js"></script>
  <script src="/api/docs/assets/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: 'StandaloneLayout'
      });
      window.ui = ui;
    };
  </script>
</body>
</html>`);
});
app.get('/api/docs/swagger.json', (req: Request, res: Response): void => {
  res.json(swaggerSpec);
});

/**
 * Registrar Rotas
 */
app.use('/api/auth', authRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', usersRoutes);

<<<<<<< HEAD
/**
 * Final handlers
 */
=======
// Middlewares de tratamento de rotas e erros devem vir por último
>>>>>>> main
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

<<<<<<< HEAD

=======
>>>>>>> main
