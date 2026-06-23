/**
 * Auth Service - N Eyes
 * Lógica de autenticação (register, login, logout, refresh tokens)
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');
const tokenRevocationService = require('./tokenRevocation.service');

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
 * Retorna access token e refresh token
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

  // Gerar access token (curta duração: 15 minutos)
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role, email: user.email, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '15m' }
  );

  // Gerar refresh token (longa duração: 7 dias)
  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    accessToken,
    refreshToken,
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
 * Faz logout do usuário
 * Revoga os tokens
 */
function logout({ accessToken, refreshToken }) {
  // Decodificar refresh token para obter expiração
  try {
    const decoded = jwt.decode(refreshToken);
    const expiresAt = decoded?.exp || Math.floor(Date.now() / 1000) + 86400; // padrão 1 dia

    // Adicionar tokens à blacklist
    tokenRevocationService.revokeToken(accessToken, expiresAt);
    tokenRevocationService.revokeToken(refreshToken, expiresAt);

    return true;
  } catch (err) {
    console.error('Erro ao revogar tokens no logout:', err);
    return true; // Não falhar o logout mesmo se erro
  }
}

/**
 * Renova o access token usando refresh token
 * @param {string} refreshToken
 * @returns {Object} Novo access token
 */
function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new Error('Refresh token não fornecido');
  }

  try {
    // Verificar se refresh token está revogado
    if (tokenRevocationService.isTokenRevoked(refreshToken)) {
      throw new Error('Refresh token foi revogado');
    }

    // Validar refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    if (decoded.type !== 'refresh') {
      throw new Error('Token inválido: não é um refresh token');
    }

    // Buscar usuário
    const user = UserModel.findById(decoded.userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Gerar novo access token
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return {
      accessToken: newAccessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (err) {
    throw new Error(`Erro ao renovar token: ${err.message}`);
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
  refreshAccessToken
};
