/**
 * N Eyes - Mock Data System
 * Simula dados de monitoramento de rede com variações realistas
 */

class DataSimulator {
  constructor() {
    this.devices = this.initializeDevices();
    this.metrics = this.initializeMetrics();
    this.logs = this.initializeLogs();
    this.alerts = [];
    this.listeners = [];
    
    this.loadFromStorage();
  }

  // ============ DEVICES ============
  initializeDevices() {
    return [
      { id: 1, ip: '192.168.1.101', name: 'Desktop-Office', type: 'desktop', bandwidth: 45.2, status: 'online', blocked: false },
      { id: 2, ip: '192.168.1.102', name: 'Laptop-Sales', type: 'laptop', bandwidth: 32.8, status: 'online', blocked: false },
      { id: 3, ip: '192.168.1.103', name: 'Server-01', type: 'server', bandwidth: 128.5, status: 'online', blocked: false },
      { id: 4, ip: '192.168.1.104', name: 'Impressora-HP', type: 'printer', bandwidth: 2.1, status: 'online', blocked: false },
      { id: 5, ip: '192.168.1.105', name: 'Celular-João', type: 'mobile', bandwidth: 18.3, status: 'online', blocked: false },
      { id: 6, ip: '192.168.1.106', name: 'Câmera-Entrada', type: 'camera', bandwidth: 5.6, status: 'online', blocked: false },
      { id: 7, ip: '192.168.1.107', name: 'Switch-01', type: 'switch', bandwidth: 0.3, status: 'online', blocked: false },
      { id: 8, ip: '192.168.1.108', name: 'Telefone-VoIP', type: 'voip', bandwidth: 1.2, status: 'online', blocked: false },
      { id: 9, ip: '192.168.1.109', name: 'NAS-Backup', type: 'nas', bandwidth: 95.4, status: 'online', blocked: false },
      { id: 10, ip: '192.168.1.110', name: 'Firewall', type: 'firewall', bandwidth: 0.1, status: 'online', blocked: false },
      { id: 11, ip: '192.168.1.111', name: 'Desktop-Financeiro', type: 'desktop', bandwidth: 12.5, status: 'offline', blocked: false },
      { id: 12, ip: '192.168.1.112', name: 'Tablet-Meeting', type: 'mobile', bandwidth: 8.9, status: 'online', blocked: false },
      { id: 13, ip: '192.168.1.113', name: 'Printer-Canon', type: 'printer', bandwidth: 0.8, status: 'online', blocked: false },
      { id: 14, ip: '192.168.1.114', name: 'Câmera-Saída', type: 'camera', bandwidth: 4.2, status: 'online', blocked: false },
      { id: 15, ip: '192.168.1.115', name: 'Laptop-IT', type: 'laptop', bandwidth: 55.7, status: 'online', blocked: false },
    ];
  }

  initializeMetrics() {
    const now = Date.now();
    const metrics = [];
    
    // Criar 60 pontos de dados (1 hora, dados a cada minuto)
    for (let i = 59; i >= 0; i--) {
      metrics.push({
        timestamp: now - (i * 60000),
        download: this.generateRealisticValue(45, 120),
        upload: this.generateRealisticValue(20, 80),
        connectedDevices: 14,
        latency: this.generateRealisticValue(5, 30)
      });
    }
    
    return metrics;
  }

  initializeLogs() {
    const now = Date.now();
    const logTypes = ['device_connected', 'device_disconnected', 'device_blocked', 'config_changed', 'threshold_exceeded'];
    const devices = this.devices;
    const logs = [];

    for (let i = 0; i < 50; i++) {
      const device = devices[Math.floor(Math.random() * devices.length)];
      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      
      logs.push({
        id: i,
        timestamp: now - (i * 300000), // 5 minutos entre logs
        type: type,
        deviceIp: device.ip,
        deviceName: device.name,
        message: this.getLogMessage(type, device),
        severity: this.getLogSeverity(type)
      });
    }

    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }

  getLogMessage(type, device) {
    const messages = {
      device_connected: `Dispositivo ${device.name} conectado à rede`,
      device_disconnected: `Dispositivo ${device.name} desconectado da rede`,
      device_blocked: `Dispositivo ${device.name} bloqueado pelo administrador`,
      config_changed: `Configurações de monitoramento atualizadas`,
      threshold_exceeded: `Limiar de bandwidth excedido em ${device.name}`
    };
    return messages[type] || 'Evento de rede registrado';
  }

  getLogSeverity(type) {
    const severities = {
      device_connected: 'info',
      device_disconnected: 'warning',
      device_blocked: 'warning',
      config_changed: 'info',
      threshold_exceeded: 'critical'
    };
    return severities[type] || 'info';
  }

  // ============ SIMULAÇÃO DE DADOS EM TEMPO REAL ============
  
  generateRealisticValue(min, max) {
    // Gerar valores com tendência (não completamente aleatório)
    const random = Math.random();
    
    if (random < 0.7) {
      // 70% de chance: valor próximo à média
      const mean = (min + max) / 2;
      return mean + (Math.random() - 0.5) * (max - min) * 0.4;
    } else {
      // 30% de chance: picos/quedas
      return min + Math.random() * (max - min);
    }
  }

  updateMetrics() {
    const lastMetric = this.metrics[this.metrics.length - 1];
    
    const newMetric = {
      timestamp: Date.now(),
      download: this.generateRealisticValue(30, 150),
      upload: this.generateRealisticValue(15, 100),
      connectedDevices: this.devices.filter(d => d.status === 'online').length,
      latency: this.generateRealisticValue(3, 50)
    };

    this.metrics.push(newMetric);

    // Manter apenas últimas 60 métricas (1 hora)
    if (this.metrics.length > 60) {
      this.metrics.shift();
    }

    this.notifyListeners('metrics-updated', newMetric);
  }

  updateDeviceStatus() {
    // Ocasionalmente desconectar/reconectar dispositivos
    const randomDevice = this.devices[Math.floor(Math.random() * this.devices.length)];
    
    if (Math.random() < 0.05) { // 5% de chance de mudança de status
      const oldStatus = randomDevice.status;
      randomDevice.status = randomDevice.status === 'online' ? 'offline' : 'online';
      
      // Adicionar log dessa mudança
      this.addLog(
        randomDevice.status === 'online' ? 'device_connected' : 'device_disconnected',
        randomDevice
      );

      this.notifyListeners('device-status-changed', {
        deviceId: randomDevice.id,
        oldStatus,
        newStatus: randomDevice.status
      });
    }

    // Variar bandwidth
    this.devices.forEach(device => {
      if (device.status === 'online') {
        device.bandwidth = this.generateRealisticValue(0, 150);
      } else {
        device.bandwidth = 0;
      }
    });
  }

  addLog(type, device) {
    const log = {
      id: this.logs.length,
      timestamp: Date.now(),
      type: type,
      deviceIp: device.ip,
      deviceName: device.name,
      message: this.getLogMessage(type, device),
      severity: this.getLogSeverity(type)
    };

    this.logs.unshift(log); // Adicionar no início
    
    // Manter apenas últimos 500 logs
    if (this.logs.length > 500) {
      this.logs.pop();
    }

    this.notifyListeners('log-added', log);
  }

  // ============ DEVICE ACTIONS ============

  blockDevice(deviceId) {
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.blocked = true;
      this.addLog('device_blocked', device);
      this.notifyListeners('device-blocked', device);
      this.saveToStorage();
    }
  }

  unblockDevice(deviceId) {
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.blocked = false;
      this.addLog('device_unblocked', device);
      this.notifyListeners('device-unblocked', device);
      this.saveToStorage();
    }
  }

  renameDevice(deviceId, newName) {
    const device = this.devices.find(d => d.id === deviceId);
    if (device && newName.trim()) {
      const oldName = device.name;
      device.name = newName;
      
      this.addLog('device_renamed', { ...device, oldName });
      this.notifyListeners('device-renamed', { deviceId, oldName, newName });
      this.saveToStorage();
    }
  }

  // ============ ALERT RULES ============

  addAlertRule(rule) {
    this.alerts.push({
      id: Date.now(),
      ...rule,
      createdAt: Date.now()
    });
    this.saveToStorage();
    this.notifyListeners('alert-rule-added', rule);
  }

  removeAlertRule(ruleId) {
    this.alerts = this.alerts.filter(a => a.id !== ruleId);
    this.saveToStorage();
    this.notifyListeners('alert-rule-removed', ruleId);
  }

  // ============ STORAGE ============

  saveToStorage() {
    const data = {
      devices: this.devices,
      alerts: this.alerts,
      timestamp: Date.now()
    };
    localStorage.setItem('neyes_data', JSON.stringify(data));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('neyes_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.devices = data.devices || this.devices;
        this.alerts = data.alerts || this.alerts;
      } catch (e) {
        console.error('Erro ao carregar dados do storage', e);
      }
    }
  }

  // ============ EVENT LISTENERS ============

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (e) {
        console.error('Erro em listener:', e);
      }
    });
  }

  // ============ GETTERS ============

  getDevices() {
    return [...this.devices];
  }

  getDevice(id) {
    return this.devices.find(d => d.id === id);
  }

  getMetrics() {
    return [...this.metrics];
  }

  getLogs(limit = 50) {
    return this.logs.slice(0, limit);
  }

  getAlertRules() {
    return [...this.alerts];
  }

  getTotalBandwidth() {
    return this.devices
      .filter(d => d.status === 'online')
      .reduce((sum, d) => sum + d.bandwidth, 0);
  }

  getOnlineDevices() {
    return this.devices.filter(d => d.status === 'online').length;
  }

  getOfflineDevices() {
    return this.devices.filter(d => d.status === 'offline').length;
  }

  // ============ AGREGAÇÕES ============

  getHourlyStats() {
    const stats = {};
    const hourAgo = Date.now() - (60 * 60 * 1000);

    this.metrics.forEach(metric => {
      if (metric.timestamp >= hourAgo) {
        stats.avgDownload = stats.avgDownload 
          ? (stats.avgDownload + metric.download) / 2 
          : metric.download;
        stats.avgUpload = stats.avgUpload 
          ? (stats.avgUpload + metric.upload) / 2 
          : metric.upload;
        stats.maxDownload = Math.max(stats.maxDownload || 0, metric.download);
        stats.maxUpload = Math.max(stats.maxUpload || 0, metric.upload);
      }
    });

    return stats;
  }

  getPeakHours() {
    const peaks = this.metrics
      .sort((a, b) => (b.download + b.upload) - (a.download + a.upload))
      .slice(0, 5);
    return peaks;
  }
}

// ============ INICIALIZAÇÃO GLOBAL ============
// Criar instância global quando o script for carregado
console.log('[data.js] Inicializando DataSimulator...');
window.dataSimulator = new DataSimulator();
console.log('[data.js] DataSimulator criado com sucesso');

// Instância global
const dataSimulator = new DataSimulator();
