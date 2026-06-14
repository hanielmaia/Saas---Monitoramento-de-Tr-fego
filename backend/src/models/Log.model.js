/**
 * Log Model - N Eyes
 * Repository pattern para operações de logs
 */

const db = require('../config/database');

const COLLECTION = 'logs';

/**
 * Encontra log por ID
 */
function findById(id) {
  return db.findById(COLLECTION, id);
}

/**
 * Obtém todos os logs
 */
function findAll() {
  return db.findAll(COLLECTION);
}

/**
 * Encontra logs por filtro
 */
function findWhere(predicate) {
  return db.findWhere(COLLECTION, predicate);
}

/**
 * Cria novo log
 */
function create(data) {
  return db.create(COLLECTION, data);
}

/**
 * Atualiza log
 */
function update(id, data) {
  return db.update(COLLECTION, id, data);
}

/**
 * Deleta log
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
