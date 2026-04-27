/**
 * Data Service - N Eyes
 * Camada de serviço para gerenciar dados mockados
 * Fornece interface consistente de acesso aos dados
 */

class DataService {
  constructor() {
    // Inicializa dados em memória a partir do mockData
    if (typeof mockData !== 'undefined') {
      this.devices = [...mockData.devices];
      this.logs = [...mockData.logs];
      this.users = [...mockData.users];
      this.settings = { ...mockData.settings };
    } else {
      console.error('mockData não carregado. Verifique se mockData.js foi incluído.');
    }
  }

  // ========== AUTENTICAÇÃO ==========

  /**
   * Autentica usuário com mock data
   */
  authenticateUser(email, password) {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Busca usuário no mock data
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      return { ...user };
    }

    // Se não encontrado, cria usuário fictício com os dados fornecidos
    return {
      id: Math.random(),
      name: email.split('@')[0].replace(/[._-]/g, ' '),
      email: email,
      role: 'USER',
      department: 'IT'
    };
  }

  // ========== DISPOSITIVOS ==========

  /**
   * Retorna todos os dispositivos
   */
  getDevices() {
    return this.devices;
  }

  /**
   * Retorna um dispositivo específico
   */
  getDevice(id) {
    return this.devices.find(d => d.id === id);
  }

  /**
   * Adiciona um novo dispositivo
   */
  addDevice(hostname, ip) {
    const newDevice = {
      id: this.devices.length > 0 ? Math.max(...this.devices.map(d => d.id)) + 1 : 1,
      ip: ip || `192.168.1.${120 + this.devices.length}`,
      name: hostname || `Device-${Date.now()}`,
      type: 'PC',
      status: 'online',
      bandwidth: Math.round(Math.random() * 300) + ' Mbps',
      lastSeen: new Date().toLocaleString('pt-BR'),
      owner: 'admin'
    };
    this.devices.push(newDevice);

    // Registra evento de conexão no log
    this.addLog({
      eventType: 'Conexão',
      source: `${newDevice.ip} | ${newDevice.name}`,
      details: 'Novo dispositivo adicionado (simulação)',
      user: 'admin',
      severity: 'INFO'
    });

    return newDevice;
  }

  /**
   * Remove um dispositivo
   */
  deleteDevice(id) {
    const index = this.devices.findIndex(d => d.id === id);
    if (index > -1) {
      const device = this.devices[index];
      this.devices.splice(index, 1);

      // Registra evento de desconexão no log
      this.addLog({
        eventType: 'Desconexão',
        source: `${device.ip} | ${device.name}`,
        details: 'Dispositivo removido (simulação)',
        user: 'admin',
        severity: 'INFO'
      });

      return true;
    }
    return false;
  }

  /**
   * Atualiza um dispositivo
   */
  updateDevice(id, updates) {
    const device = this.devices.find(d => d.id === id);
    if (device) {
      Object.assign(device, updates, { lastSeen: new Date().toLocaleString('pt-BR') });
      return device;
    }
    return null;
  }

  /**
   * Altera status de um dispositivo
   */
  toggleDeviceStatus(id) {
    const device = this.getDevice(id);
    if (device) {
      device.status = device.status === 'online' ? 'offline' : 'online';
      device.lastSeen = new Date().toLocaleString('pt-BR');
      return device;
    }
    return null;
  }

  // ========== LOGS ==========

  /**
   * Retorna todos os logs
   */
  getLogs() {
    return this.logs;
  }

  /**
   * Filtra logs por critérios
   */
  filterLogs(criteria = {}) {
    let filtered = [...this.logs];

    if (criteria.severity) {
      filtered = filtered.filter(log => log.severity === criteria.severity);
    }

    if (criteria.search) {
      const search = criteria.search.toLowerCase();
      filtered = filtered.filter(log =>
        (log.source && log.source.toLowerCase().includes(search)) ||
        (log.details && log.details.toLowerCase().includes(search)) ||
        (log.user && log.user.toLowerCase().includes(search))
      );
    }

    if (criteria.dateStart) {
      filtered = filtered.filter(log => log.timestamp >= criteria.dateStart);
    }

    if (criteria.dateEnd) {
      filtered = filtered.filter(log => log.timestamp <= criteria.dateEnd);
    }

    if (criteria.eventType) {
      filtered = filtered.filter(log => log.eventType === criteria.eventType);
    }

    return filtered;
  }

  /**
   * Adiciona novo log
   */
  addLog(log) {
    const newLog = {
      id: this.logs.length > 0 ? Math.max(...this.logs.map(l => l.id)) + 1 : 1,
      timestamp: new Date().toLocaleString('pt-BR'),
      ...log
    };
    this.logs.unshift(newLog);
    return newLog;
  }

  // ========== CONFIGURAÇÕES ==========

  /**
   * Obtém configurações do sistema
   */
  getSettings() {
    const stored = localStorage.getItem('neyes_settings');
    return stored ? JSON.parse(stored) : this.settings;
  }

  /**
   * Salva configurações
   */
  saveSettings(settings) {
    this.settings = { ...settings };
    localStorage.setItem('neyes_settings', JSON.stringify(settings));
    return this.settings;
  }

  // ========== ESTATÍSTICAS ==========

  /**
   * Obtém estatísticas da rede
   */
  getStatistics() {
    const online = this.devices.filter(d => d.status === 'online').length;
    const offline = this.devices.filter(d => d.status === 'offline').length;
    const blocked = this.devices.filter(d => d.status === 'blocked').length;

    return {
      totalDevices: this.devices.length,
      online,
      offline,
      blocked,
      totalLogs: this.logs.length
    };
  }

  /**
   * Obtém atividades recentes
   */
  getRecentActivity(limit = 5) {
    return this.logs.slice(0, limit);
  }
}

// Instância global
const dataService = new DataService();
