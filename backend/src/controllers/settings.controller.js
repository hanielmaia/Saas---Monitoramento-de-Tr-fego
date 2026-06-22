/**
 * Settings Controller - N Eyes
 * Endpoints de configurações
 */

const { getSettings, updateSettings } = require('../services/settings.service');

/**
 * GET /api/settings
 * Obtém configurações atuais
 */
function index(req, res, next) {
  try {
    const settings = getSettings();

    return res.status(200).json({
      status: 'success',
      data: settings
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/settings
 * Atualiza configurações
 */
function save(req, res, next) {
  try {
    const data = req.body;

    // Validações básicas
    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum campo para atualizar'
      });
    }

    const settings = updateSettings(data);

    return res.status(200).json({
      status: 'success',
      message: 'Configurações atualizadas com sucesso',
      data: settings
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  index,
  save
};
