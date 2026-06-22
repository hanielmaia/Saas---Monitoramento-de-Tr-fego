/**
 * Data Service - N Eyes
 * Serviço centralizado para chamadas à API do backend
 * Usa apiCall() de api.service.js para garantir autenticação e tratamento de erros
 */

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

/**
 * Normaliza resposta da API
 * @param {Object} response - Resposta do apiCall
 * @returns {Object} Dados normalizados
 */
function normalizeResponse(response) {
    // Se a resposta tem um objeto 'data', retorna apenas os dados
    if (response && response.data) {
        return response.data;
    }
    // Senão, retorna a resposta inteira
    return response;
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
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall('/devices', {
            method: 'GET'
        });

        return normalizeResponse(result);
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
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall('/devices/stats', {
            method: 'GET'
        });

        return normalizeResponse(result);
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
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall(`/devices/${id}`, {
            method: 'GET'
        });

        return normalizeResponse(result);
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
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall('/devices', {
            method: 'POST',
            body: deviceData
        });

        return normalizeResponse(result);
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
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall(`/devices/${id}`, {
            method: 'PATCH',
            body: updates
        });

        return normalizeResponse(result);
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
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall(`/devices/${id}`, {
            method: 'DELETE'
        });

        return normalizeResponse(result);
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
        let endpoint = '/logs';
        const params = new URLSearchParams();
        
        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.eventType) params.append('eventType', filters.eventType);
        if (filters.device) params.append('device', filters.device);
        if (filters.dateStart) params.append('dateStart', filters.dateStart);
        if (filters.dateEnd) params.append('dateEnd', filters.dateEnd);

        if (params.toString()) {
            endpoint += '?' + params.toString();
        }

        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall(endpoint, {
            method: 'GET'
        });

        return normalizeResponse(result);
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
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall(`/logs/${id}`, {
            method: 'GET'
        });

        return normalizeResponse(result);
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
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall('/logs', {
            method: 'POST',
            body: logData
        });

        return normalizeResponse(result);
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
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall(`/logs/${id}`, {
            method: 'DELETE'
        });

        return normalizeResponse(result);
    } catch (error) {
        console.error('[deleteLog] Erro:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * CONFIGURAÇÕES
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Busca configurações
 * @returns {Promise<Object>} Configurações
 */
export async function getSettings() {
    try {
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall('/settings', {
            method: 'GET'
        });

        return normalizeResponse(result);
    } catch (error) {
        console.error('[getSettings] Erro:', error);
        throw error;
    }
}

/**
 * Atualiza configurações
 * @param {Object} updates - Dados a atualizar
 * @returns {Promise<Object>} Configurações atualizadas
 */
export async function updateSettings(updates) {
    try {
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall('/settings', {
            method: 'PATCH',
            body: updates
        });

        return normalizeResponse(result);
    } catch (error) {
        console.error('[updateSettings] Erro:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * USUÁRIOS
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Busca dados do usuário logado
 * @returns {Promise<Object>} Dados do usuário
 */
export async function getCurrentUser() {
    try {
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall('/auth/me', {
            method: 'GET'
        });

        return normalizeResponse(result);
    } catch (error) {
        console.error('[getCurrentUser] Erro:', error);
        throw error;
    }
}

/**
 * Atualiza dados do usuário logado
 * @param {Object} updates - Dados a atualizar
 * @returns {Promise<Object>} Usuário atualizado
 */
export async function updateUser(updates) {
    try {
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall('/users/me', {
            method: 'PATCH',
            body: updates
        });

        return normalizeResponse(result);
    } catch (error) {
        console.error('[updateUser] Erro:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * AUTENTICAÇÃO
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Faz login
 * ⚠️ NOTA: Preferir usar auth.service.js para manter consistência
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} Resposta de login (token, user)
 */
export async function login(email, password) {
    try {
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        // Login é a única chamada que NÃO inclui token (ainda não autenticado)
        const result = await apiCall('/auth/login', {
            method: 'POST',
            body: { email, password }
        });

        // Salvar token e usuário após login bem-sucedido
        if (result.token && result.user) {
            localStorage.setItem(CONFIG.STORAGE.TOKEN_KEY, result.token);
            localStorage.setItem(CONFIG.STORAGE.USER_KEY, JSON.stringify(result.user));
        }

        return normalizeResponse(result);
    } catch (error) {
        console.error('[login] Erro:', error);
        throw error;
    }
}

/**
 * Faz registro/cadastro
 * @param {string} name - Nome do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} Resposta de registro
 */
export async function register(name, email, password) {
    try {
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        // Registro é a única chamada que NÃO inclui token (ainda não autenticado)
        const result = await apiCall('/auth/register', {
            method: 'POST',
            body: { name, email, password }
        });

        return normalizeResponse(result);
    } catch (error) {
        console.error('[register] Erro:', error);
        throw error;
    }
}

/**
 * Faz logout
 * @returns {Promise<void>}
 */
export async function logout() {
    try {
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        // Tentar notificar servidor
        await apiCall('/auth/logout', {
            method: 'POST'
        }).catch(() => {
            // Se falhar, continuar mesmo assim
        });

        // Limpar localStorage
        localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
        localStorage.removeItem(CONFIG.STORAGE.USER_KEY);

        return true;
    } catch (error) {
        // Sempre limpar dados locais mesmo se erro
        localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
        localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
        return true;
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
        // ✅ USA getDevices() que usa apiCall()
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
        // Retornar valores padrão em caso de erro
        return {
            download: 0,
            upload: 0,
            devicesOnline: 0,
            devicesOffline: 0,
            devicesBlocked: 0,
        };
    }
}
