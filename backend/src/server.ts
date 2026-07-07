import 'dotenv/config';
import app from './app.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const logger = require('./utils/logger.cjs');
const tokenRevocationService = require('./services/tokenRevocation.service');

/**
 * Validação de Variáveis de Ambiente Obrigatórias
 */
function validateEnvironment() {
  const requiredVars = ['JWT_SECRET'];
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ ERRO: Variáveis de ambiente obrigatórias não configuradas:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\n📝 Verifique seu arquivo .env e certifique-se de que contém:');
    console.error('   JWT_SECRET=sua_chave_secreta_super_segura_com_32_caracteres_minimo');
    process.exit(1);
  }
}

// Validar antes de iniciar
validateEnvironment();

const port = parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? 'localhost';

app.listen(port, host, () => {
  logger.info({ host, port, environment: process.env.NODE_ENV ?? 'development' }, 'Servidor iniciado');
  console.log(`\n✅ Servidor iniciado`);
  console.log(`📡 URL: http://${host}:${port}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV ?? 'development'}\n`);

  // Iniciar cleanup automático de tokens revogados (a cada 6 horas)
  tokenRevocationService.startCleanupInterval(6);
});
