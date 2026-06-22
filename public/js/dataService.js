/**
 * Data Service - N Eyes
 * Serviço centralizado para chamadas à API do backend
 * Substitui o arquivo /src/dataService.js que não é acessível no frontend
 */

const API_BASE_URL = '/api';

/**
 * ═══════════════════════════════════════════════════════════════
 * TRATAMENTO DE ERROS
 * ═══════════════════════════════════════════════════════════════
 */
class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

async function handleAPIResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new APIError(
            data.message || `HTTP Error: ${response.status}`,
            response.status,
            data
        );
    }

    return data;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * DEVICES
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Busca todos os dispositivos
 * @returns {Promise<Array>} Lista de dispositivos
 */
export async function getDevices() {
    try {
        const response = await fetch(`${API_BASE_URL}/devices`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[getDevices] Erro:', error);
        throw error;
    }
}

/**
 * Busca estatísticas de dispositivos
 * @returns {Promise<Object>} Estatísticas
 */
export async function getDeviceStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[getDeviceStats] Erro:', error);
        throw error;
    }
}

/**
 * Busca um dispositivo específico
 * @param {number} id - ID do dispositivo
 * @returns {Promise<Object>} Dispositivo
 */
export async function getDeviceById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[getDeviceById] Erro:', error);
        throw error;
    }
}

/**
 * Cria um novo dispositivo
 * @param {Object} deviceData - Dados do dispositivo
 * @returns {Promise<Object>} Dispositivo criado
 */
export async function createDevice(deviceData) {
    try {
        const response = await fetch(`${API_BASE_URL}/devices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deviceData),
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[createDevice] Erro:', error);
        throw error;
    }
}

/**
 * Atualiza um dispositivo
 * @param {number} id - ID do dispositivo
 * @param {Object} updates - Dados a atualizar
 * @returns {Promise<Object>} Dispositivo atualizado
 */
export async function updateDevice(id, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[updateDevice] Erro:', error);
        throw error;
    }
}

/**
 * Deleta um dispositivo
 * @param {number} id - ID do dispositivo
 * @returns {Promise<void>}
 */
export async function deleteDevice(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[deleteDevice] Erro:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * LOGS
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Busca todos os logs com filtros opcionais
 * @param {Object} filters - Filtros (keyword, eventType, device, dateStart, dateEnd)
 * @returns {Promise<Array>} Lista de logs
 */
export async function getLogs(filters = {}) {
    try {
        // Construir query string
        const queryParams = new URLSearchParams();
        if (filters.keyword) queryParams.append('keyword', filters.keyword);
        if (filters.eventType) queryParams.append('eventType', filters.eventType);
        if (filters.device) queryParams.append('device', filters.device);
        if (filters.dateStart) queryParams.append('dateStart', filters.dateStart);
        if (filters.dateEnd) queryParams.append('dateEnd', filters.dateEnd);

        const url = `${API_BASE_URL}/logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[getLogs] Erro:', error);
        throw error;
    }
}

/**
 * Busca um log específico
 * @param {number} id - ID do log
 * @returns {Promise<Object>} Log
 */
export async function getLogById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/logs/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[getLogById] Erro:', error);
        throw error;
    }
}

/**
 * Cria um novo log
 * @param {Object} logData - Dados do log
 * @returns {Promise<Object>} Log criado
 */
export async function createLog(logData) {
    try {
        const response = await fetch(`${API_BASE_URL}/logs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logData),
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[createLog] Erro:', error);
        throw error;
    }
}

/**
 * Deleta um log
 * @param {number} id - ID do log
 * @returns {Promise<void>}
 */
export async function deleteLog(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/logs/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[deleteLog] Erro:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * MÉTRICAS (Dados agregados para dashboard)
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Busca métricas do dashboard
 * Calcula valores baseado nos dispositivos disponíveis
 * @returns {Promise<Object>} Métricas (download, upload, etc)
 */
export async function getMetrics() {
    try {
        const devices = await getDevices();

        if (!Array.isArray(devices) || devices.length === 0) {
            return {
                download: 0,
                upload: 0,
                devicesOnline: 0,
                devicesOffline: 0,
                devicesBlocked: 0,
            };
        }

        // Calcular métricas agregadas
        const totalBandwidth = devices.reduce((sum, device) => sum + (device.bandwidth || 0), 0);
        const devicesOnline = devices.filter(d => d.status === 'Online').length;
        const devicesOffline = devices.filter(d => d.status === 'Offline').length;
        const devicesBlocked = devices.filter(d => d.status === 'Blocked').length;

        // Simular split entre download e upload (2/3 download, 1/3 upload)
        const download = totalBandwidth * 0.67;
        const upload = totalBandwidth * 0.33;

        return {
            download: parseFloat(download.toFixed(1)),
            upload: parseFloat(upload.toFixed(1)),
            devicesOnline,
            devicesOffline,
            devicesBlocked,
            totalDevices: devices.length,
        };
    } catch (error) {
        console.error('[getMetrics] Erro:', error);
        return {
            download: 0,
            upload: 0,
            devicesOnline: 0,
            devicesOffline: 0,
            devicesBlocked: 0,
        };
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * AUTENTICAÇÃO
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Faz login
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} Resposta de login (token, user)
 */
export async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[login] Erro:', error);
        throw error;
    }
}

/**
 * Faz logout
 * @returns {Promise<void>}
 */
export async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[logout] Erro:', error);
        throw error;
    }
}

/**
 * Busca dados do usuário logado
 * @returns {Promise<Object>} Dados do usuário
 */
export async function getMe() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[getMe] Erro:', error);
        throw error;
    }
}

/**
 * Registra um novo usuário
 * @param {Object} userData - Dados do usuário (name, email, password)
 * @returns {Promise<Object>} Usuário criado
 */
export async function register(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include',
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[register] Erro:', error);
        throw error;
    }
}
