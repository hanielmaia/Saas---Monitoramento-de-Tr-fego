import 'dotenv/config';
import app from './app.js';

const port = parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? 'localhost';

app.listen(port, host, () => {
  console.log(`\n✅ Servidor iniciado`);
  console.log(`📡 URL: http://${host}:${port}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV ?? 'development'}\n`);
});
