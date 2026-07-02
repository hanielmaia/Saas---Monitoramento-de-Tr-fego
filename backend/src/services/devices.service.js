const prisma = require('../config/prismaClient.cjs');

async function getAllDevices(filters = {}) {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.hostname) {
    where.hostname = {
      contains: filters.hostname,
      mode: 'insensitive'
    };
  }

  if (filters.ip) {
    where.ip = {
      contains: filters.ip
    };
  }

  return prisma.device.findMany({ where });
}

async function getDeviceById(id) {
  const device = await prisma.device.findUnique({
    where: { id }
  });

  if (!device) {
    throw new Error('Dispositivo não encontrado');
  }

  return device;
}

async function createDevice(data) {
  return prisma.device.create({
    data: {
      ip: data.ip,
      hostname: data.hostname,
      status: data.status || 'Offline',
      bandwidth: data.bandwidth ?? 0,
      blocked: data.blocked ?? false,
      lastSeen: new Date()
    }
  });
}

async function updateDevice(id, data) {
  const existing = await prisma.device.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new Error('Dispositivo não encontrado');
  }

  return prisma.device.update({
    where: { id },
    data: {
      ...(data.hostname !== undefined && { hostname: data.hostname }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.bandwidth !== undefined && { bandwidth: data.bandwidth }),
      ...(data.blocked !== undefined && { blocked: data.blocked }),
      lastSeen: new Date()
    }
  });
}

async function deleteDevice(id) {
  const existing = await prisma.device.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new Error('Dispositivo não encontrado');
  }

  await prisma.device.delete({
    where: { id }
  });

  return { success: true, id };
}

async function getDeviceStats() {
  const devices = await prisma.device.findMany();

  const total = devices.length;
  const online = devices.filter(d => d.status === 'Online').length;
  const offline = devices.filter(d => d.status === 'Offline').length;
  const blocked = devices.filter(d => d.blocked).length;
  const avgBandwidth = total > 0
    ? parseFloat((devices.reduce((sum, d) => sum + (d.bandwidth || 0), 0) / total).toFixed(2))
    : 0;

  return {
    total,
    online,
    offline,
    blocked,
    avgBandwidth
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
