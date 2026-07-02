/**
 * Logs Controller - N Eyes
 * Endpoints de logs (CRUD com filtros)
 */

const logsService = require('../services/logs.service');
const { APIError } = require('../middlewares/errorHandler');

/**
 * GET /api/logs
 * Lista todos os logs com filtros opcionais
 */
function getAllLogs(req, res, next) {
  try {
    const filters = {
      keyword: req.query.keyword,
      eventType: req.query.eventType,
      device: req.query.device,
      dateStart: req.query.dateStart,
      dateEnd: req.query.dateEnd
    };

    const logs = logsService.getAllLogs(filters);

    return res.status(200).json({
      status: 'success',
      data: logs,
      count: logs.length
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/logs/:id
 * Obtém log por ID
 */
function getLogById(req, res, next) {
  try {
    const { id } = req.params;
    const log = logsService.getLogById(parseInt(id));

    return res.status(200).json({
      status: 'success',
      data: log
    });
  } catch (err) {
    if (err.message === 'Log não encontrado') {
      return next(new APIError(err.message, 404));
    }
    next(err);
  }
}

/**
 * POST /api/logs
 * Cria novo log
 */
function createLog(req, res, next) {
  try {
    const { deviceId, deviceName, message, severity, type } = req.body;

    // Validar entrada
    if (!deviceId || !deviceName || !message) {
      throw new APIError('Erro de validação', 400, {
        deviceId: !deviceId ? 'Obrigatório' : null,
        deviceName: !deviceName ? 'Obrigatório' : null,
        message: !message ? 'Obrigatório' : null
      });
    }

    const log = logsService.createLog({
      deviceId,
      deviceName,
      message,
      severity,
      type
    });

    return res.status(201).json({
      status: 'success',
      message: 'Log criado com sucesso',
      data: log
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/logs/:id
 * Deleta log
 */
function deleteLog(req, res, next) {
  try {
    const { id } = req.params;
    const result = logsService.deleteLog(parseInt(id));

    return res.status(200).json({
      status: 'success',
      message: 'Log deletado com sucesso',
      data: result
    });
  } catch (err) {
    if (err.message === 'Log não encontrado') {
      return next(new APIError(err.message, 404));
    }
    next(err);
  }
}

module.exports = {
  getAllLogs,
  getLogById,
  createLog,
  deleteLog
};
