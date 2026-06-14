/**
 * Auth Service - N Eyes
 * Lógica de autenticação (register, login, logout)
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');

/**
 * Registra novo usuário
 */
async function register({ name, email, password }) {
  // Verificar se usuário já existe
  const existing = UserModel.findByEmail(email);
  if (existing) {
    throw new Error('E-mail já cadastrado');
  }

  // Hashear senha
  const passwordHash = await bcrypt.hash(password, 10);

  // Criar usuário com role padrão
  const user = UserModel.create({
    name,
    email,
    passwordHash,
    role: 'USER'
  });

  // Retornar sem a senha
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Faz login do usuário
 */
async function login({ email, password }) {
  // Encontrar usuário
  const user = UserModel.findByEmail(email);
  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // Verificar senha
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Credenciais inválidas');
  }

  // Gerar token JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'seu_secret_aqui',
    { expiresIn: process.env.JWT_EXPIRATION || '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

/**
 * Obtém dados do usuário logado
 */
function me(userId) {
  const user = UserModel.findById(userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Faz logout (simples, sem salvar sessão)
 */
function logout() {
  // Em um sistema real, invalidaríamos o token aqui
  // Por enquanto, apenas retornamos sucesso
  return true;
}

module.exports = {
  register,
  login,
  me,
  logout
};
