import 'dotenv/config';
import app from './app';

const port: number = parseInt(process.env.PORT || '3000', 10);
const host: string = process.env.HOST || 'localhost';

app.listen(port, host, () => {
  console.log(`✅ Servidor rodando em http://${host}:${port}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
