/**
 * Users Controller - N Eyes
 * Endpoints de usuários (CRUD)
 */

const { getAllUsers, getUserById, updateProfile, deleteUser } = require('../services/users.service');

/**
 * GET /api/users
 * Lista todos os usuários (apenas admin)
 */
function index(req, res, next) {
  try {
    const users = getAllUsers();

    return res.status(200).json({
      status: 'success',
      data: users,
      count: users.length
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/me
 * Obtém dados do usuário logado (já está em /api/auth/me)
 * Mantido por compatibilidade
 */
function getMe(req, res, next) {
  try {
    const user = getUserById(req.userId);

    return res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    if (err.message === 'Usuário não encontrado') {
      return res.status(404).json({
        status: 'error',
        message: err.message
      });
    }
    next(err);
  }
}

/**
 * GET /api/users/:id
 * Obtém usuário por ID
 */
function getById(req, res, next) {
  try {
    const { id } = req.params;
    const user = getUserById(parseInt(id));

    return res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    if (err.message === 'Usuário não encontrado') {
      return res.status(404).json({
        status: 'error',
        message: err.message
      });
    }
    next(err);
  }
}

/**
 * PATCH /api/users/me
 * Atualiza perfil do usuário
 */
async function updateMe(req, res, next) {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await updateProfile(req.userId, {
      name,
      email,
      currentPassword,
      newPassword
    });

    return res.status(200).json({
      status: 'success',
      message: 'Perfil atualizado com sucesso',
      data: user
    });
  } catch (err) {
    if (err.message.includes('Usuário não encontrado') || 
        err.message.includes('Senha atual incorreta') ||
        err.message.includes('Este e-mail já está em uso') ||
        err.message.includes('Informe a senha atual')) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    next(err);
  }
}

/**
 * DELETE /api/users/:id
 * Deleta usuário (apenas admin)
 */
function remove(req, res, next) {
  try {
    const { id } = req.params;
    const result = deleteUser(parseInt(id));

    return res.status(200).json({
      status: 'success',
      message: 'Usuário deletado com sucesso',
      data: result
    });
  } catch (err) {
    if (err.message === 'Usuário não encontrado') {
      return res.status(404).json({
        status: 'error',
        message: err.message
      });
    }
    next(err);
  }
}

module.exports = {
  index,
  getMe,
  getById,
  updateMe,
  remove
};
