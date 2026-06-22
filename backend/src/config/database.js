/**
 * Database Configuration - N Eyes
 * Abstração para db.json
 * Implementa operações de I/O e sincronização
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, process.env.DB_PATH || '../../db.json');

/**
 * Lê dados do db.json
 * @returns {Object} Dados do banco
 */
function readDatabase() {
  try {
    if (!fs.existsSync(dbPath)) {
      throw new Error(`Banco de dados não encontrado em ${dbPath}`);
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler banco de dados:', error.message);
    throw new Error('Erro ao ler banco de dados');
  }
}

/**
 * Escreve dados no db.json
 * @param {Object} data - Dados a escrever
 */
function writeDatabase(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao escrever banco de dados:', error.message);
    throw new Error('Erro ao escrever banco de dados');
  }
}

/**
 * Obtém dados de uma coleção específica
 * @param {string} collection - Nome da coleção
 * @returns {Array}
 */
function getCollection(collection) {
  const db = readDatabase();
  return db[collection] || [];
}

/**
 * Salva alterações em uma coleção
 * @param {string} collection - Nome da coleção
 * @param {Array} data - Dados da coleção
 */
function saveCollection(collection, data) {
  const db = readDatabase();
  db[collection] = data;
  writeDatabase(db);
  return true;
}

/**
 * Obtém um item por ID de uma coleção
 * @param {string} collection - Nome da coleção
 * @param {number} id - ID do item
 * @returns {Object|null}
 */
function findById(collection, id) {
  const items = getCollection(collection);
  return items.find(item => item.id === id) || null;
}

/**
 * Obtém todos os itens de uma coleção
 * @param {string} collection - Nome da coleção
 * @returns {Array}
 */
function findAll(collection) {
  return getCollection(collection);
}

/**
 * Cria novo item em uma coleção
 * @param {string} collection - Nome da coleção
 * @param {Object} data - Dados do novo item
 * @returns {Object} Item criado
 */
function create(collection, data) {
  const items = getCollection(collection);
  const id = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { id, ...data, createdAt: new Date().toISOString() };
  items.push(newItem);
  saveCollection(collection, items);
  return newItem;
}

/**
 * Atualiza item em uma coleção
 * @param {string} collection - Nome da coleção
 * @param {number} id - ID do item
 * @param {Object} data - Dados a atualizar
 * @returns {Object|null} Item atualizado
 */
function update(collection, id, data) {
  const items = getCollection(collection);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...data,
    id: items[index].id, // Preserva o ID
    updatedAt: new Date().toISOString()
  };
  
  saveCollection(collection, items);
  return items[index];
}

/**
 * Deleta item de uma coleção
 * @param {string} collection - Nome da coleção
 * @param {number} id - ID do item
 * @returns {boolean} Success
 */
function remove(collection, id) {
  const items = getCollection(collection);
  const filtered = items.filter(item => item.id !== id);
  
  if (filtered.length === items.length) {
    return false; // Item não encontrado
  }
  
  saveCollection(collection, filtered);
  return true;
}

/**
 * Encontra items por critério
 * @param {string} collection - Nome da coleção
 * @param {Function} predicate - Função de filtro
 * @returns {Array}
 */
function findWhere(collection, predicate) {
  const items = getCollection(collection);
  return items.filter(predicate);
}

module.exports = {
  readDatabase,
  writeDatabase,
  getCollection,
  saveCollection,
  findById,
  findAll,
  create,
  update,
  remove,
  findWhere
};
