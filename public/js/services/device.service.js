/**
 * Device Service - N Eyes
 * Serviço centralizado para operações com dispositivos
 */

/**
 * Busca todos os dispositivos com filtros opcionais
 * @param {Object} filters - Filtros { status, hostname, ip }
 * @returns {Promise<Array>}
 */
async function fetchAllDevices(filters = {}) {
  try {
    let devices = await getDevices();

    // Aplicar filtros localmente (se necessário)
    if (filters.status) {
      devices = devices.filter(d => d.status === filters.status);
    }

    if (filters.hostname) {
      devices = devices.filter(d => 
        d.hostname.toLowerCase().includes(filters.hostname.toLowerCase())
      );
    }

    if (filters.ip) {
      devices = devices.filter(d => 
        d.ip.includes(filters.ip)
      );
    }

    return devices;

  } catch (error) {
    console.error('Erro ao buscar dispositivos:', error);
    throw error;
  }
}

/**
 * Bloqueia/desbloqueia um dispositivo
 * @param {number} id - ID do dispositivo
 * @param {boolean} blocked - True para bloquear, false para desbloquear
 * @returns {Promise<Object>}
 */
async function toggleDeviceBlock(id, blocked = true) {
  try {
    return await updateDevice(id, { blocked });
  } catch (error) {
    console.error(`Erro ao ${blocked ? 'bloquear' : 'desbloquear'} dispositivo:`, error);
    throw error;
  }
}

/**
 * Renomeia um dispositivo
 * @param {number} id - ID do dispositivo
 * @param {string} hostname - Novo nome
 * @returns {Promise<Object>}
 */
async function renameDevice(id, hostname) {
  try {
    return await updateDevice(id, { hostname });
  } catch (error) {
    console.error('Erro ao renomear dispositivo:', error);
    throw error;
  }
}

/**
 * Obtém dispositivos agrupados por status
 * @returns {Promise<Object>} { online: [], offline: [], blocked: [] }
 */
async function getDevicesGroupedByStatus() {
  try {
    const devices = await getDevices();
    
    return {
      online: devices.filter(d => d.status === 'ONLINE' && !d.blocked),
      offline: devices.filter(d => d.status === 'OFFLINE'),
      blocked: devices.filter(d => d.blocked),
      idle: devices.filter(d => d.status === 'IDLE')
    };

  } catch (error) {
    console.error('Erro ao agrupar dispositivos:', error);
    throw error;
  }
}

/**
 * Calcula estatísticas de dispositivos
 * @returns {Promise<Object>}
 */
async function getDeviceStats() {
  try {
    const devices = await getDevices();

    return {
      total: devices.length,
      online: devices.filter(d => d.status === 'ONLINE').length,
      offline: devices.filter(d => d.status === 'OFFLINE').length,
      blocked: devices.filter(d => d.blocked).length,
      avgBandwidth: (devices.reduce((sum, d) => sum + (d.bandwidth || 0), 0) / devices.length).toFixed(2)
    };

  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    throw error;
  }
}

// Exportar para global scope
if (typeof window !== 'undefined') {
  Object.assign(window, {
    fetchAllDevices,
    toggleDeviceBlock,
    renameDevice,
    getDevicesGroupedByStatus,
    getDeviceStats
  });
}
