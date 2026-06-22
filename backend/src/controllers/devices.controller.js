/**
 * Devices Controller - N Eyes
 * Endpoints de dispositivos (CRUD)
 */

const devicesService = require('../services/devices.service');
const { validateDevice } = require('../utils/validation');

/**
 * GET /api/devices
 * Lista todos os dispositivos com filtros opcionais
 */
function getAllDevices(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      hostname: req.query.hostname,
      ip: req.query.ip
    };

    const devices = devicesService.getAllDevices(filters);

    return res.status(200).json({
      status: 'success',
      data: devices,
      count: devices.length
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/devices/:id
 * Obtém dispositivo por ID
 */
function getDeviceById(req, res, next) {
  try {
    const { id } = req.params;
    const device = devicesService.getDeviceById(parseInt(id));

    return res.status(200).json({
      status: 'success',
      data: device
    });
  } catch (err) {
    if (err.message === 'Dispositivo não encontrado') {
      return res.status(404).json({
        status: 'error',
        message: err.message
      });
    }
    next(err);
  }
}

/**
 * POST /api/devices
 * Cria novo dispositivo
 */
function createDevice(req, res, next) {
  try {
    const { ip, hostname, status, bandwidth, blocked } = req.body;

    // Validar entrada
    const validation = validateDevice({ ip, hostname });
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Erro de validação',
        errors: validation.errors
      });
    }

    const device = devicesService.createDevice({
      ip,
      hostname,
      status,
      bandwidth,
      blocked
    });

    return res.status(201).json({
      status: 'success',
      message: 'Dispositivo criado com sucesso',
      data: device
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/devices/:id
 * Atualiza dispositivo
 */
function updateDevice(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    // Validar entrada
    const validation = validateDevice(data);
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Erro de validação',
        errors: validation.errors
      });
    }

    const device = devicesService.updateDevice(parseInt(id), data);

    return res.status(200).json({
      status: 'success',
      message: 'Dispositivo atualizado com sucesso',
      data: device
    });
  } catch (err) {
    if (err.message === 'Dispositivo não encontrado') {
      return res.status(404).json({
        status: 'error',
        message: err.message
      });
    }
    next(err);
  }
}

/**
 * DELETE /api/devices/:id
 * Deleta dispositivo
 */
function deleteDevice(req, res, next) {
  try {
    const { id } = req.params;
    const result = devicesService.deleteDevice(parseInt(id));

    return res.status(200).json({
      status: 'success',
      message: 'Dispositivo deletado com sucesso',
      data: result
    });
  } catch (err) {
    if (err.message === 'Dispositivo não encontrado') {
      return res.status(404).json({
        status: 'error',
        message: err.message
      });
    }
    next(err);
  }
}

/**
 * GET /api/devices/stats
 * Obtém estatísticas de dispositivos
 */
function getDeviceStats(req, res, next) {
  try {
    const stats = devicesService.getDeviceStats();

    return res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceStats
};
