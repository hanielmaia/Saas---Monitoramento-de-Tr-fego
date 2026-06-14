/**
 * User Model - N Eyes
 * Repository pattern para operações de usuário
 */

const db = require('../config/database');

const COLLECTION = 'users';

/**
 * Encontra usuário por ID
 */
function findById(id) {
  return db.findById(COLLECTION, id);
}

/**
 * Encontra usuário por email
 */
function findByEmail(email) {
  const users = db.getCollection(COLLECTION);
  return users.find(u => u.email === email) || null;
}

/**
 * Obtém todos os usuários
 */
function findAll() {
  return db.findAll(COLLECTION);
}

/**
 * Cria novo usuário
 */
function create(data) {
  return db.create(COLLECTION, data);
}

/**
 * Atualiza usuário
 */
function update(id, data) {
  return db.update(COLLECTION, id, data);
}

/**
 * Deleta usuário
 */
function remove(id) {
  return db.remove(COLLECTION, id);
}

module.exports = {
  findById,
  findByEmail,
  findAll,
  create,
  update,
  remove
};
