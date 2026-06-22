import 'dotenv/config';
import app from './app.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const logger = require('./utils/logger.cjs');

const port = parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? 'localhost';

app.listen(port, host, () => {
  logger.info({ host, port, environment: process.env.NODE_ENV ?? 'development' }, 'Servidor iniciado');
});
