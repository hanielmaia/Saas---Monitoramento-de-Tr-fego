import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jsonServer from 'json-server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8000;

// Configurar json-server
const db = JSON.parse(fs.readFileSync('db.json', 'UTF-8'));
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

// Criar app express-like do json-server
const app = jsonServer.create();

// Usar middlewares padrão
app.use(middlewares);

// Usar router para /api/
app.use('/api', router);

// Middleware para servir arquivos estáticos
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

app.use((req, res, next) => {
  // Ignorar requisições da API
  if (req.path.startsWith('/api')) {
    return next();
  }

  let filePath = path.join(__dirname, req.url);
  if (req.url === '/' || req.url === '') {
    filePath = path.join(__dirname, 'src/pages/login.html');
  }

  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Página não encontrada</h1>', 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>Erro do servidor</h1>', 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         🛡️  N EYES - MONITORAMENTO DE TRÁFEGO  🛡️         ║
╚═══════════════════════════════════════════════════════════╝

✅ Servidor rodando em http://localhost:${PORT}
📄 Página inicial: http://localhost:${PORT}/src/pages/login.html
🔌 API: http://localhost:${PORT}/api/devices
📊 API: http://localhost:${PORT}/api/logs

🚀 Pressione Ctrl+C para parar o servidor
  `);
});
