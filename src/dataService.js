/**
 * Data Service - N Eyes
 * Camada de serviço para gerenciar dados de dispositivos, logs e tráfego
 * Atua como intermediária entre o frontend e os dados mock (ou API futura)
 */

class DataService {
  constructor() {
    // Inicializa dados em memória a partir do mockData
    this.devices = [...mockData.devices];
    this.logs = [...mockData.logs];
    this.trafficSamples = [...mockData.trafficSamples];
    this.notifications = [...mockData.notifications];
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
      hostname: hostname || `Device-${Date.now()}`,
      bandwidth: Math.random() * 300,
      status: 'ONLINE',
      blocked: false,
      lastSeen: new Date(),
    };
    this.devices.push(newDevice);

    // Registra evento de conexão no log
    this.addLog({
      eventType: 'CONNECTION',
      origin: `${newDevice.ip} | ${newDevice.hostname}`,
      details: 'Novo dispositivo adicionado (simulação)',
      user: 'admin',
      severity: 'INFO',
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
        eventType: 'DISCONNECTION',
        origin: `${device.ip} | ${device.hostname}`,
        details: 'Dispositivo removido (simulação)',
        user: 'admin',
        severity: 'INFO',
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
      const oldName = device.hostname;
      Object.assign(device, updates);

      // Registra evento de mudança se o nome foi alterado
      if (updates.hostname && oldName !== updates.hostname) {
        this.addLog({
          eventType: 'RENAME',
          origin: `${device.ip} | ${device.hostname}`,
          details: `Nome alterado de "${oldName}" para "${updates.hostname}"`,
          user: 'admin',
          severity: 'INFO',
        });
      }

      // Registra evento de bloqueio
      if (updates.blocked !== undefined && updates.blocked !== device.blocked) {
        const eventType = updates.blocked ? 'BLOCK' : 'UNBLOCK';
        const action = updates.blocked ? 'Dispositivo bloqueado' : 'Dispositivo desbloqueado';
        this.addLog({
          eventType: eventType,
          origin: `${device.ip} | ${device.hostname}`,
          details: action,
          user: 'admin',
          severity: 'WARNING',
        });
      }

      return device;
    }
    return null;
  }

  /**
   * Bloqueia/Desbloqueia um dispositivo
   */
  toggleBlockDevice(id) {
    const device = this.devices.find(d => d.id === id);
    if (device) {
      device.blocked = !device.blocked;
      const eventType = device.blocked ? 'BLOCK' : 'UNBLOCK';
      const action = device.blocked ? 'Dispositivo bloqueado' : 'Dispositivo desbloqueado';

      // Registra no log
      this.addLog({
        eventType: eventType,
        origin: `${device.ip} | ${device.hostname}`,
        details: action,
        user: 'admin',
        severity: 'WARNING',
      });

      return device;
    }
    return null;
  }

  /**
   * Retorna estatísticas de dispositivos
   */
  getDeviceStats() {
    const online = this.devices.filter(d => d.status === 'ONLINE').length;
    const offline = this.devices.filter(d => d.status === 'OFFLINE').length;
    const blocked = this.devices.filter(d => d.blocked).length;

    return {
      total: this.devices.length,
      online,
      offline,
      blocked,
      avgBandwidth: this.devices.reduce((sum, d) => sum + d.bandwidth, 0) / this.devices.length || 0,
    };
  }

  // ========== LOGS ==========

  /**
   * Retorna todos os logs
   */
  getLogs(limit = 50) {
    return this.logs.slice(-limit).reverse();
  }

  /**
   * Filtra logs por critérios
   */
  filterLogs(criteria) {
    let filtered = [...this.logs];

    if (criteria.search) {
      const search = criteria.search.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.origin.toLowerCase().includes(search) ||
          log.details.toLowerCase().includes(search) ||
          log.user.toLowerCase().includes(search)
      );
    }

    if (criteria.eventType && criteria.eventType !== '') {
      filtered = filtered.filter(log => log.eventType === criteria.eventType);
    }

    if (criteria.severity && criteria.severity !== '') {
      filtered = filtered.filter(log => log.severity === criteria.severity);
    }

    if (criteria.dateStart) {
      const startDate = new Date(criteria.dateStart);
      filtered = filtered.filter(log => log.timestamp >= startDate);
    }

    if (criteria.dateEnd) {
      const endDate = new Date(criteria.dateEnd);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => log.timestamp <= endDate);
    }

    return filtered.slice(-50).reverse();
  }

  /**
   * Adiciona um novo log
   */
  addLog(logData) {
    const newLog = {
      id: (this.logs.length > 0 ? Math.max(...this.logs.map(l => l.id)) : 0) + 1,
      timestamp: new Date(),
      eventType: logData.eventType || 'INFO',
      origin: logData.origin || 'SYSTEM',
      details: logData.details || '',
      user: logData.user || 'system',
      severity: logData.severity || 'INFO',
    };
    this.logs.push(newLog);
    return newLog;
  }

  // ========== TRÁFEGO ==========

  /**
   * Retorna amostras de tráfego
   */
  getTrafficSamples() {
    return this.trafficSamples;
  }

  /**
   * Simula atualização de tráfego (com variação)
   */
  updateTrafficSimulation() {
    // Remove a amostra mais antiga
    this.trafficSamples.shift();

    // Adiciona nova amostra com leve variação
    const lastSample = this.trafficSamples[this.trafficSamples.length - 1];
    const newTime = new Date();
    const hours = String(newTime.getHours()).padStart(2, '0');
    const minutes = String(newTime.getMinutes()).padStart(2, '0');

    const newSample = {
      time: `${hours}:${minutes}`,
      download: Math.max(100, lastSample.download + (Math.random() - 0.5) * 100),
      upload: Math.max(50, lastSample.upload + (Math.random() - 0.5) * 50),
      maliciousScore: Math.max(0, Math.min(100, lastSample.maliciousScore + (Math.random() - 0.5) * 15)),
    };

    this.trafficSamples.push(newSample);
    return newSample;
  }

  /**
   * Retorna métricas do dashboard
   */
  getMetrics() {
    const stats = this.getDeviceStats();
    return {
      downloadCurrent: this.trafficSamples[this.trafficSamples.length - 1]?.download || 245.8,
      uploadCurrent: this.trafficSamples[this.trafficSamples.length - 1]?.upload || 128.4,
      devicesConnected: stats.online,
      devicesTotal: stats.total,
      maliciousScore: this.trafficSamples[this.trafficSamples.length - 1]?.maliciousScore || 6,
    };
  }

  // ========== NOTIFICAÇÕES ==========

  /**
   * Retorna notificações
   */
  getNotifications() {
    return this.notifications;
  }

  /**
   * Adiciona uma notificação
   */
  addNotification(title, message, type = 'info') {
    const notification = {
      id: (this.notifications.length > 0 ? Math.max(...this.notifications.map(n => n.id)) : 0) + 1,
      title,
      message,
      time: new Date(),
      type,
      icon: type === 'warning' ? 'triangle-alert' : 'info',
    };
    this.notifications.unshift(notification);

    // Mantém apenas as últimas 10 notificações
    if (this.notifications.length > 10) {
      this.notifications.pop();
    }

    return notification;
  }

  // ========== UTILITÁRIOS ==========

  /**
   * Reseta todos os dados ao estado inicial
   */
  reset() {
    this.devices = [...mockData.devices];
    this.logs = [...mockData.logs];
    this.trafficSamples = [...mockData.trafficSamples];
    this.notifications = [...mockData.notifications];
  }

  /**
   * Exporta dados em formato CSV (para download)
   */
  exportDevicesCSV() {
    let csv = 'IP,Hostname,Bandwidth (Mbps),Status,Blocked\n';
    this.devices.forEach(d => {
      csv += `${d.ip},"${d.hostname}",${d.bandwidth.toFixed(2)},${d.status},${d.blocked ? 'Yes' : 'No'}\n`;
    });
    return csv;
  }

  /**
   * Exporta logs em formato CSV
   */
  exportLogsCSV() {
    let csv = 'Timestamp,Event Type,Origin,Details,User,Severity\n';
    this.logs.forEach(l => {
      csv += `"${l.timestamp.toLocaleString()}","${l.eventType}","${l.origin}","${l.details}","${l.user}","${l.severity}"\n`;
    });
    return csv;
  }
}

// Inicializa instância global
const dataService = new DataService();
