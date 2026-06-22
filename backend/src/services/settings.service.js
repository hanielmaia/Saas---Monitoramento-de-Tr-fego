/**
 * Settings Service - N Eyes
 * Lógica de operações com configurações
 */

const SettingsModel = require('../models/Settings.model');

/**
 * Obtém configurações atuais
 */
function getSettings() {
  let settings = SettingsModel.findSettings();

  if (!settings) {
    // Criar configurações padrão se não existirem
    settings = SettingsModel.update({
      alertThreshold: 80,
      scanFrequency: 30,
      quarantineEnabled: false,
      allowedIpRange: '192.168.0.0/16',
      monitoredPorts: '80,443,8080',
      retentionDays: 30,
      autoArchive: true,
      minPasswordLength: 6,
      requireUppercase: false,
      requireNumbers: false,
      requireSpecialChars: false
    });
  }

  return settings;
}

/**
 * Atualiza configurações
 */
function updateSettings(data) {
  const current = getSettings();

  const updatedData = {
    ...(data.alertThreshold !== undefined && { alertThreshold: parseInt(data.alertThreshold) }),
    ...(data.scanFrequency !== undefined && { scanFrequency: parseInt(data.scanFrequency) }),
    ...(data.quarantineEnabled !== undefined && { quarantineEnabled: data.quarantineEnabled === true || data.quarantineEnabled === 'true' }),
    ...(data.allowedIpRange !== undefined && { allowedIpRange: data.allowedIpRange }),
    ...(data.monitoredPorts !== undefined && { monitoredPorts: data.monitoredPorts }),
    ...(data.retentionDays !== undefined && { retentionDays: parseInt(data.retentionDays) }),
    ...(data.autoArchive !== undefined && { autoArchive: data.autoArchive === true || data.autoArchive === 'true' }),
    ...(data.minPasswordLength !== undefined && { minPasswordLength: parseInt(data.minPasswordLength) }),
    ...(data.requireUppercase !== undefined && { requireUppercase: data.requireUppercase === true || data.requireUppercase === 'true' }),
    ...(data.requireNumbers !== undefined && { requireNumbers: data.requireNumbers === true || data.requireNumbers === 'true' }),
    ...(data.requireSpecialChars !== undefined && { requireSpecialChars: data.requireSpecialChars === true || data.requireSpecialChars === 'true' })
  };

  return SettingsModel.update(updatedData);
}

// Para compatibilidade com rotas antigas
function saveSettings(body) {
  return updateSettings(body);
}

module.exports = {
  getSettings,
  updateSettings,
  saveSettings
};

