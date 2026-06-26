/**
 * Token Revocation Service - N Eyes
 * Gerencia lista negra de tokens revogados (logout)
 * Em produção, usar Redis para melhor performance
 */

const fs = require('fs');
const path = require('path');

const BLACKLIST_FILE = path.join(__dirname, '../../blacklist.json');

/**
 * Carrega blacklist do arquivo
 */
function loadBlacklist() {
  try {
    if (fs.existsSync(BLACKLIST_FILE)) {
      const data = fs.readFileSync(BLACKLIST_FILE, 'utf-8');
      return JSON.parse(data) || [];
    }
  } catch (err) {
    console.error('Erro ao carregar blacklist:', err);
  }
  return [];
}

/**
 * Salva blacklist no arquivo
 */
function saveBlacklist(blacklist) {
  try {
    fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(blacklist, null, 2));
  } catch (err) {
    console.error('Erro ao salvar blacklist:', err);
  }
}

/**
 * Adiciona token à blacklist (revoga)
 * @param {string} token - JWT token
 * @param {number} expiresAt - Timestamp de expiração do token
 */
function revokeToken(token, expiresAt) {
  if (!token) return;

  const blacklist = loadBlacklist();
  
  // Evitar duplicatas
  if (blacklist.find(entry => entry.token === token)) {
    return;
  }

  blacklist.push({
    token,
    revokedAt: new Date().toISOString(),
    expiresAt // Útil para limpeza periódica
  });

  saveBlacklist(blacklist);
}

/**
 * Verifica se token está revogado
 * @param {string} token - JWT token
 * @returns {boolean}
 */
function isTokenRevoked(token) {
  if (!token) return false;

  const blacklist = loadBlacklist();
  return blacklist.some(entry => entry.token === token);
}

/**
 * Obtém todos os tokens revogados
 * @returns {Array}
 */
function getBlacklist() {
  return loadBlacklist();
}

/**
 * Limpa tokens expirados da blacklist (Limpeza periódica)
 * Executar periodicamente via cron job ou intervalo
 */
function cleanExpiredTokens() {
  const blacklist = loadBlacklist();
  const now = Math.floor(Date.now() / 1000); // timestamp em segundos

  // Filtra apenas tokens que ainda não expiraram
  const filtered = blacklist.filter(entry => {
    return entry.expiresAt > now;
  });

  if (filtered.length !== blacklist.length) {
    console.log(`[TokenRevocation] Limpeza: ${blacklist.length - filtered.length} tokens expirados removidos`);
    saveBlacklist(filtered);
  }

  return filtered.length;
}

/**
 * Limpa toda a blacklist (USE COM CUIDADO!)
 * Útil apenas em testes
 */
function clearBlacklist() {
  try {
    fs.writeFileSync(BLACKLIST_FILE, '[]');
    return true;
  } catch (err) {
    console.error('Erro ao limpar blacklist:', err);
    return false;
  }
}

/**
 * Inicia limpeza automática de tokens expirados
 * Executar a cada 6 horas
 */
function startCleanupInterval(intervalHours = 6) {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  setInterval(() => {
    const remaining = cleanExpiredTokens();
    console.log(`[TokenRevocation] Cleanup executado. ${remaining} tokens ativos na blacklist.`);
  }, intervalMs);

  console.log(`[TokenRevocation] Cleanup automático iniciado (a cada ${intervalHours}h)`);
}

module.exports = {
  revokeToken,
  isTokenRevoked,
  getBlacklist,
  cleanExpiredTokens,
  clearBlacklist,
  startCleanupInterval
};
