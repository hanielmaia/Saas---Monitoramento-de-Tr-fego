/**
 * Devices Controller - N Eyes
 * Endpoints de dispositivos (CRUD)
 */

const devicesService = require('../services/devices.service');
const { validateDevice } = require('../utils/validation');
const { APIError } = require('../middlewares/errorHandler');

/**
 * GET /api/devices
 * Lista todos os dispositivos com filtros opcionais
 */
async function getAllDevices(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      hostname: req.query.hostname,
      ip: req.query.ip
    };

    const devices = await devicesService.getAllDevices(filters);

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
async function getDeviceById(req, res, next) {
  try {
    const { id } = req.params;
    const device = await devicesService.getDeviceById(parseInt(id, 10));

    return res.status(200).json({
      status: 'success',
      data: device
    });
  } catch (err) {
    if (err.message === 'Dispositivo não encontrado') {
      return next(new APIError(err.message, 404));
    }
    next(err);
  }
}

/**
 * POST /api/devices
 * Cria novo dispositivo
 */
async function createDevice(req, res, next) {
  try {
    const { ip, hostname, status, bandwidth, blocked } = req.body;

    const validation = validateDevice({ ip, hostname });
    if (!validation.valid) {
      throw new APIError('Erro de validação', 400, validation.errors);
    }

    const device = await devicesService.createDevice({
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
async function updateDevice(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    const validation = validateDevice(data);
    if (!validation.valid) {
      throw new APIError('Erro de validação', 400, validation.errors);
    }

    const device = await devicesService.updateDevice(parseInt(id, 10), data);

    return res.status(200).json({
      status: 'success',
      message: 'Dispositivo atualizado com sucesso',
      data: device
    });
  } catch (err) {
    if (err.message === 'Dispositivo não encontrado') {
      return next(new APIError(err.message, 404));
    }
    next(err);
  }
}

/**
 * DELETE /api/devices/:id
 * Deleta dispositivo
 */
async function deleteDevice(req, res, next) {
  try {
    const { id } = req.params;
    const result = await devicesService.deleteDevice(parseInt(id, 10));

    return res.status(200).json({
      status: 'success',
      message: 'Dispositivo deletado com sucesso',
      data: result
    });
  } catch (err) {
    if (err.message === 'Dispositivo não encontrado') {
      return next(new APIError(err.message, 404));
    }
    next(err);
  }
}

/**
 * GET /api/devices/stats
 * Obtém estatísticas de dispositivos
 */
async function getDeviceStats(req, res, next) {
  try {
    const stats = await devicesService.getDeviceStats();

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
