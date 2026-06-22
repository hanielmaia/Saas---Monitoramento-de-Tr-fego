/**
 * Users Service - N Eyes
 * Lógica de operações com usuários
 */

const bcrypt = require('bcrypt');
const UserModel = require('../models/User.model');

/**
 * Obtém todos os usuários (sem senhas)
 */
function getAllUsers() {
  const users = UserModel.findAll();
  return users.map(u => {
    const { passwordHash: _, ...user } = u;
    return user;
  });
}

/**
 * Obtém usuário por ID (sem senha)
 */
function getUserById(userId) {
  const user = UserModel.findById(userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Atualiza perfil do usuário
 */
async function updateProfile(userId, { name, email, currentPassword, newPassword }) {
  const user = UserModel.findById(userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Validar senha atual se fornecida
  if (currentPassword || newPassword) {
    if (!currentPassword) {
      throw new Error('Informe a senha atual para trocar a senha');
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new Error('Senha atual incorreta');
    }
  }

  const updateData = {};

  if (name && name.trim()) {
    updateData.name = name.trim();
  }

  if (email && email !== user.email) {
    const exists = UserModel.findByEmail(email);
    if (exists) {
      throw new Error('Este e-mail já está em uso');
    }
    updateData.email = email;
  }

  if (newPassword) {
    updateData.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const updated = UserModel.update(userId, updateData);
  const { passwordHash: _, ...userWithoutPassword } = updated;
  return userWithoutPassword;
}

/**
 * Deleta usuário
 */
function deleteUser(userId) {
  const user = UserModel.findById(userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  UserModel.remove(userId);
  return { success: true, id: userId };
}

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser
};
