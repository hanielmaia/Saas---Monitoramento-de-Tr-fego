/**
 * Data Service Layer - N Eyes
 * Centraliza todas as requisições à API usando Fetch API
 * Segue o padrão ES6 Modules (ESM) com import/export
 */

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Tratamento centralizado de erros
 * @param {string} operation - Nome da operação para logging
 * @param {Error} error - Erro capturado
 */
function handleError(operation, error) {
    console.error(`[${operation}] Erro:`, error.message);
    throw {
        operation,
        message: error.message,
        status: error.status || 'unknown'
    };
}

/**
 * Busca todos os dispositivos
 * @returns {Promise<Array>} Array com todos os dispositivos
 */
export async function getDevices() {
    try {
        const response = await fetch(`${API_BASE_URL}/devices`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        handleError('getDevices', error);
    }
}

/**
 * Busca um dispositivo específico pelo ID
 * @param {number} id - ID do dispositivo
 * @returns {Promise<Object>} Dados do dispositivo
 */
export async function getDevice(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        handleError(`getDevice(${id})`, error);
    }
}

/**
 * Atualiza dados de um dispositivo (bloquear, renomear, etc)
 * @param {number} id - ID do dispositivo
 * @param {Object} data - Dados a atualizar (hostname, status, etc)
 * @returns {Promise<Object>} Dispositivo atualizado
 */
export async function updateDevice(id, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        handleError(`updateDevice(${id})`, error);
    }
}

/**
 * Deleta um dispositivo
 * @param {number} id - ID do dispositivo
 * @returns {Promise<Object>} Resposta da servidor
 */
export async function deleteDevice(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return { success: true, id };
    } catch (error) {
        handleError(`deleteDevice(${id})`, error);
    }
}

/**
 * Busca logs com filtros opcionais
 * @param {Object} filters - Objeto com filtros opcionais
 * @param {string} filters.keyword - Palavra-chave para buscar (dispositivo, usuário, evento)
 * @param {string} filters.eventType - Tipo de evento para filtrar
 * @param {string} filters.device - Nome ou IP do dispositivo
 * @param {string} filters.dateStart - Data de início (formato YYYY-MM-DD)
 * @param {string} filters.dateEnd - Data de fim (formato YYYY-MM-DD)
 * @returns {Promise<Array>} Array com logs filtrados
 */
export async function getLogs(filters = {}) {
    try {
        // Fetch da API conforme Seção 3.3 do APRESENTACAO.md
        const response = await fetch(`${API_BASE_URL}/logs`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        let logs = await response.json();

        // Filtrar por palavra-chave (Seção 7.5: filtragem em JavaScript)
        if (filters.keyword && filters.keyword.trim()) {
            const kw = filters.keyword.toLowerCase();
            logs = logs.filter(log =>
                (log.deviceName && log.deviceName.toLowerCase().includes(kw)) ||
                (log.message && log.message.toLowerCase().includes(kw)) ||
                (log.type && log.type.toLowerCase().includes(kw))
            );
        }

        // Filtrar por tipo de evento
        if (filters.eventType && filters.eventType.trim()) {
            logs = logs.filter(log => log.type === filters.eventType);
        }

        // Filtrar por dispositivo (IP ou nome)
        if (filters.device && filters.device.trim()) {
            const dev = filters.device.toLowerCase();
            logs = logs.filter(log =>
                (log.deviceName && log.deviceName.toLowerCase().includes(dev))
            );
        }

        // Filtrar por data de início (Seção 7.5: lógica de comparação de datas)
        if (filters.dateStart) {
            const startDate = new Date(filters.dateStart);
            startDate.setHours(0, 0, 0, 0);
            const startTime = startDate.getTime();
            logs = logs.filter(log => new Date(log.timestamp).getTime() >= startTime);
        }

        // Filtrar por data de fim (inclui todo o dia da data fim)
        if (filters.dateEnd) {
            const endDate = new Date(filters.dateEnd);
            endDate.setHours(23, 59, 59, 999); // Incluir até o final do dia
            const endTime = endDate.getTime();
            logs = logs.filter(log => new Date(log.timestamp).getTime() <= endTime);
        }

        return logs;
    } catch (error) {
        handleError('getLogs', error);
    }
}

/**
 * Busca logs de um dispositivo específico
 * @param {number} deviceId - ID do dispositivo
 * @returns {Promise<Array>} Array com logs do dispositivo
 */
export async function getLogsByDevice(deviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/logs?deviceId=${deviceId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        handleError(`getLogsByDevice(${deviceId})`, error);
    }
}

/**
 * Busca estatísticas de tráfego
 * @returns {Promise<Object>} Objeto com estatísticas
 */
export async function getTrafficStats() {
    try {
        const devices = await getDevices();
        const onlineCount = devices.filter(d => d.status === 'Online').length;
        const offlineCount = devices.filter(d => d.status === 'Offline').length;
        const totalBandwidth = devices.reduce((sum, d) => sum + d.bandwidth, 0);
        const avgBandwidth = (totalBandwidth / devices.length).toFixed(2);

        return {
            totalDevices: devices.length,
            onlineCount,
            offlineCount,
            totalBandwidth: totalBandwidth.toFixed(2),
            avgBandwidth,
            criticalBandwidth: devices.filter(d => d.bandwidth > 200).length
        };
    } catch (error) {
        handleError('getTrafficStats', error);
    }
}

/**
 * Bloqueia um dispositivo
 * @param {number} id - ID do dispositivo
 * @returns {Promise<Object>} Dispositivo atualizado
 */
export async function blockDevice(id) {
    return updateDevice(id, { status: 'Blocked' });
}

/**
 * Desbloqueia um dispositivo
 * @param {number} id - ID do dispositivo
 * @param {string} previousStatus - Status anterior ('Online' ou 'Offline')
 * @returns {Promise<Object>} Dispositivo atualizado
 */
export async function unblockDevice(id, previousStatus = 'Online') {
    return updateDevice(id, { status: previousStatus });
}

/**
 * Renomeia um dispositivo
 * @param {number} id - ID do dispositivo
 * @param {string} newName - Novo nome/hostname
 * @returns {Promise<Object>} Dispositivo atualizado
 */
export async function renameDevice(id, newName) {
    return updateDevice(id, { hostname: newName });
}

/**
 * Busca as métricas em tempo real do dashboard
 * @returns {Promise<Object>} Objeto com métricas (download, upload, devicesConnected, etc)
 */
export async function getMetrics() {
    try {
        const response = await fetch(`${API_BASE_URL}/metrics`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        handleError('getMetrics', error);
    }
}

export default {
    getDevices,
    getDevice,
    updateDevice,
    deleteDevice,
    getLogs,
    getLogsByDevice,
    getTrafficStats,
    blockDevice,
    unblockDevice,
    renameDevice,
    getMetrics
};
