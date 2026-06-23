import 'dotenv/config';
import app from './app.js';

/**
 * Validação de Variáveis de Ambiente Obrigatórias
 */
function validateEnvironment() {
  const requiredVars = ['JWT_SECRET'];
  const missing = requiredVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ ERRO: Variáveis de ambiente obrigatórias não configuradas:');
    missing.forEach(key => console.error(`   - ${key}`));
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
  console.log(`\n✅ Servidor iniciado`);
  console.log(`📡 URL: http://${host}:${port}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV ?? 'development'}\n`);
});
