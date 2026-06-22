/**
 * Logs Service - N Eyes
 * Lógica de operações com logs
 */

const LogModel = require('../models/Log.model');

/**
 * Obtém todos os logs com filtros opcionais
 */
function getAllLogs(filters = {}) {
  let logs = LogModel.findAll();

  // Filtro por keyword (busca em message, deviceName, type)
  if (filters.keyword && filters.keyword.trim()) {
    const kw = filters.keyword.toLowerCase();
    logs = logs.filter(log =>
      (log.message && log.message.toLowerCase().includes(kw)) ||
      (log.deviceName && log.deviceName.toLowerCase().includes(kw)) ||
      (log.type && log.type.toLowerCase().includes(kw))
    );
  }

  // Filtro por tipo de evento
  if (filters.eventType && filters.eventType.trim()) {
    logs = logs.filter(log => log.type === filters.eventType);
  }

  // Filtro por dispositivo
  if (filters.device && filters.device.trim()) {
    const dev = filters.device.toLowerCase();
    logs = logs.filter(log =>
      log.deviceName && log.deviceName.toLowerCase().includes(dev)
    );
  }

  // Filtro por data de início
  if (filters.dateStart) {
    const startDate = new Date(filters.dateStart);
    startDate.setHours(0, 0, 0, 0);
    logs = logs.filter(log => new Date(log.timestamp) >= startDate);
  }

  // Filtro por data de fim
  if (filters.dateEnd) {
    const endDate = new Date(filters.dateEnd);
    endDate.setHours(23, 59, 59, 999);
    logs = logs.filter(log => new Date(log.timestamp) <= endDate);
  }

  // Ordenar por data decrescente
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return logs;
}

/**
 * Obtém um log por ID
 */
function getLogById(id) {
  const log = LogModel.findById(id);
  if (!log) {
    throw new Error('Log não encontrado');
  }
  return log;
}

/**
 * Cria novo log
 */
function createLog(data) {
  return LogModel.create({
    timestamp: new Date().toISOString(),
    deviceId: data.deviceId,
    deviceName: data.deviceName,
    message: data.message,
    severity: data.severity || 'info', // info, warning, critical
    type: data.type || 'event' // connection, disconnection, bandwidth, security, etc
  });
}

/**
 * Deleta um log
 */
function deleteLog(id) {
  const log = LogModel.findById(id);
  if (!log) {
    throw new Error('Log não encontrado');
  }

  LogModel.remove(id);
  return { success: true, id };
}

module.exports = {
  getAllLogs,
  getLogById,
  createLog,
  deleteLog
};

/**
 * Deleta log
 */
function deleteLog(id) {
  const log = LogModel.findById(id);
  if (!log) {
    throw new Error('Log não encontrado');
  }

  LogModel.remove(id);
  return { success: true, id };
}

module.exports = {
  getAllLogs,
  getLogById,
  createLog,
  deleteLog
};
