/**
 * Settings Model - N Eyes
 * Repository pattern para operações de configurações
 */

const db = require('../config/database');

const COLLECTION = 'settings';

/**
 * Obtém configurações (sempre retorna primeira entrada)
 */
function findSettings() {
  const settings = db.getCollection(COLLECTION);
  return settings.length > 0 ? settings[0] : null;
}

/**
 * Atualiza configurações
 */
function update(data) {
  const settings = db.getCollection(COLLECTION);
  
  if (settings.length === 0) {
    // Criar se não existir
    return db.create(COLLECTION, data);
  }

  // Atualizar primeira entrada
  return db.update(COLLECTION, settings[0].id, data);
}

module.exports = {
  findSettings,
  update
};
