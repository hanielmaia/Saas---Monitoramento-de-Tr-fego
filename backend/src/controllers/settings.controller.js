/**
 * Settings Controller - N Eyes
 * Endpoints de configurações
 */

const { getSettings, updateSettings } = require('../services/settings.service');
const { APIError } = require('../middlewares/errorHandler');

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
      throw new APIError('Nenhum campo para atualizar', 400);
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
