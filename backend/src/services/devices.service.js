/**
 * Devices Service - N Eyes
 * Lógica de operações com dispositivos
 */

const DeviceModel = require('../models/Device.model');

/**
 * Obtém todos os dispositivos com filtros opcionais
 */
function getAllDevices(filters = {}) {
  let devices = DeviceModel.findAll();

  // Aplicar filtros
  if (filters.status) {
    devices = devices.filter(d => d.status === filters.status);
  }

  if (filters.hostname) {
    devices = devices.filter(d =>
      d.hostname.toLowerCase().includes(filters.hostname.toLowerCase())
    );
  }

  if (filters.ip) {
    devices = devices.filter(d => d.ip.includes(filters.ip));
  }

  return devices;
}

/**
 * Obtém um dispositivo por ID
 */
function getDeviceById(id) {
  const device = DeviceModel.findById(id);
  if (!device) {
    throw new Error('Dispositivo não encontrado');
  }
  return device;
}

/**
 * Cria novo dispositivo
 */
function createDevice(data) {
  return DeviceModel.create({
    ip: data.ip,
    hostname: data.hostname,
    status: data.status || 'OFFLINE',
    bandwidth: data.bandwidth || 0,
    blocked: data.blocked || false,
    lastSeen: new Date().toISOString()
  });
}

/**
 * Atualiza dispositivo
 */
function updateDevice(id, data) {
  const device = DeviceModel.findById(id);
  if (!device) {
    throw new Error('Dispositivo não encontrado');
  }

  const updated = DeviceModel.update(id, {
    ...(data.hostname && { hostname: data.hostname }),
    ...(data.status && { status: data.status }),
    ...(data.bandwidth !== undefined && { bandwidth: data.bandwidth }),
    ...(data.blocked !== undefined && { blocked: data.blocked }),
    lastSeen: new Date().toISOString()
  });

  return updated;
}

/**
 * Deleta dispositivo
 */
function deleteDevice(id) {
  const device = DeviceModel.findById(id);
  if (!device) {
    throw new Error('Dispositivo não encontrado');
  }

  DeviceModel.remove(id);
  return { success: true, id };
}

/**
 * Obtém estatísticas de dispositivos
 */
function getDeviceStats() {
  const devices = DeviceModel.findAll();

  return {
    total: devices.length,
    online: devices.filter(d => d.status === 'ONLINE').length,
    offline: devices.filter(d => d.status === 'OFFLINE').length,
    blocked: devices.filter(d => d.blocked).length,
    avgBandwidth: devices.length > 0
      ? (devices.reduce((sum, d) => sum + (d.bandwidth || 0), 0) / devices.length).toFixed(2)
      : 0
  };
}

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceStats
};
