/**
 * Device Model - N Eyes
 * Repository pattern para operações de dispositivos
 */

const db = require('../config/database');

const COLLECTION = 'devices';

/**
 * Encontra dispositivo por ID
 */
function findById(id) {
  return db.findById(COLLECTION, id);
}

/**
 * Obtém todos os dispositivos
 */
function findAll() {
  return db.findAll(COLLECTION);
}

/**
 * Encontra dispositivos por filtro
 */
function findWhere(predicate) {
  return db.findWhere(COLLECTION, predicate);
}

/**
 * Cria novo dispositivo
 */
function create(data) {
  return db.create(COLLECTION, data);
}

/**
 * Atualiza dispositivo
 */
function update(id, data) {
  return db.update(COLLECTION, id, data);
}

/**
 * Deleta dispositivo
 */
function remove(id) {
  return db.remove(COLLECTION, id);
}

module.exports = {
  findById,
  findAll,
  findWhere,
  create,
  update,
  remove
};
