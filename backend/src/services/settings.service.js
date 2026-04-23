const prisma = require('../config/prisma');

// Garante que existe exatamente uma linha de settings
async function ensureSettings() {
  const count = await prisma.setting.count();
  if (count === 0) await prisma.setting.create({ data: {} });
  return prisma.setting.findFirst();
}

async function getSettings() {
  return ensureSettings();
}

async function saveSettings(body) {
  const current = await ensureSettings();

  // Mapeia os campos do frontend para as colunas do banco
  const data = {};
  if (body.alert_threshold   !== undefined) data.alertThreshold      = parseInt(body.alert_threshold);
  if (body.scan_frequency    !== undefined) data.scanFrequency        = parseInt(body.scan_frequency);
  if (body.auto_quarantine   !== undefined) data.quarantineEnabled    = body.auto_quarantine === true || body.auto_quarantine === 'true';
  if (body.allowed_ip_range  !== undefined) data.allowedIpRange       = body.allowed_ip_range;
  if (body.monitored_ports   !== undefined) data.monitoredPorts       = body.monitored_ports;
  if (body.log_retention     !== undefined) data.retentionDays        = parseInt(body.log_retention);
  if (body.auto_archive      !== undefined) data.autoArchive          = body.auto_archive === true || body.auto_archive === 'true';
  if (body.min_password_length     !== undefined) data.minPasswordLength   = parseInt(body.min_password_length);
  if (body.uppercase_required      !== undefined) data.requireUppercase    = body.uppercase_required === true || body.uppercase_required === 'true';
  if (body.numbers_required        !== undefined) data.requireNumbers      = body.numbers_required === true || body.numbers_required === 'true';
  if (body.special_chars_required  !== undefined) data.requireSpecialChars = body.special_chars_required === true || body.special_chars_required === 'true';

  return prisma.setting.update({ where: { id: current.id }, data });
}

module.exports = { getSettings, saveSettings };

