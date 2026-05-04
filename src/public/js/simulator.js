/**
 * N Eyes - Real-Time Simulator
 * Simula atualização de dados em tempo real (SNMP/NetFlow)
 * Como se fosse WebSocket, mas sem backend
 */

class RealtimeSimulator {
  constructor(dataSimulator) {
    this.data = dataSimulator;
    this.isRunning = false;
    this.updateInterval = 5000; // 5 segundos
    this.listeners = [];
  }

  /**
   * Inicia a simulação de coleta de dados
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('✓ Simulador de tempo real iniciado');
    
    // Atualizar a cada intervalo
    this.intervalId = setInterval(() => {
      this.collectMetrics();
      this.updateDeviceStatus();
      this.checkThresholds();
    }, this.updateInterval);

    // Forçar primeira atualização
    this.collectMetrics();
  }

  /**
   * Para a simulação
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    clearInterval(this.intervalId);
    console.log('✗ Simulador de tempo real parado');
  }

  /**
   * Coleta de métricas (simula SNMP query)
   */
  collectMetrics() {
    this.data.updateMetrics();
    
    const metrics = this.data.getMetrics();
    const latest = metrics[metrics.length - 1];
    
    const eventData = {
      timestamp: latest.timestamp,
      download: latest.download,
      upload: latest.upload,
      connectedDevices: latest.connectedDevices,
      latency: latest.latency,
      source: 'snmp-simulation'
    };
    
    console.log('[RealtimeSimulator] Emitindo métrica:', eventData);
    this.emit('metrics-collected', eventData);
  }

  /**
   * Atualiza status de dispositivos (simula heartbeat)
   */
  updateDeviceStatus() {
    this.data.updateDeviceStatus();
    
    const devices = this.data.getDevices();
    this.emit('devices-updated', {
      total: devices.length,
      online: devices.filter(d => d.status === 'online').length,
      offline: devices.filter(d => d.status === 'offline').length,
      devices: devices
    });
  }

  /**
   * Verifica regras de alerta
   */
  checkThresholds() {
    const alerts = this.data.getAlertRules();
    const metrics = this.data.getMetrics()[this.data.getMetrics().length - 1];

    alerts.forEach(alert => {
      let currentValue = 0;

      if (alert.type === 'bandwidth') {
        currentValue = metrics.download + metrics.upload;
      } else if (alert.type === 'latency') {
        currentValue = metrics.latency;
      }

      let isTriggered = false;
      switch (alert.operator) {
        case '>': isTriggered = currentValue > alert.threshold; break;
        case '<': isTriggered = currentValue < alert.threshold; break;
        case '>=': isTriggered = currentValue >= alert.threshold; break;
        case '<=': isTriggered = currentValue <= alert.threshold; break;
        case '=': isTriggered = currentValue === alert.threshold; break;
      }

      if (isTriggered) {
        this.emit('alert-triggered', {
          alertId: alert.id,
          type: alert.type,
          threshold: alert.threshold,
          currentValue: currentValue,
          severity: currentValue > alert.threshold * 1.5 ? 'critical' : 'warning',
          timestamp: Date.now()
        });
      }
    });
  }

  /**
   * Simula anomalia detectada (Machine Learning)
   */
  detectAnomalies() {
    const metrics = this.data.getMetrics();
    
    if (metrics.length < 10) return;

    const values = metrics.slice(-10).map(m => m.download + m.upload);
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const lastValue = values[values.length - 1];
    const zScore = (lastValue - mean) / (stdDev || 1);

    if (Math.abs(zScore) > 2) {
      this.emit('anomaly-detected', {
        type: 'bandwidth',
        value: lastValue,
        mean: mean,
        stdDev: stdDev,
        zScore: zScore,
        severity: Math.abs(zScore) > 3 ? 'critical' : 'warning',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Simula mudanças de configuração
   */
  applyConfigChange(config) {
    this.emit('config-applied', {
      ...config,
      timestamp: Date.now(),
      status: 'success'
    });
  }

  /**
   * Event emitter
   */
  on(event, listener) {
    this.listeners.push({ event, listener });
    return () => {
      this.listeners = this.listeners.filter(l => !(l.event === event && l.listener === listener));
    };
  }

  emit(event, data) {
    this.listeners
      .filter(l => l.event === event)
      .forEach(l => {
        try {
          l.listener(data);
        } catch (e) {
          console.error(`Erro em listener de ${event}:`, e);
        }
      });
  }

  /**
   * Status do simulador
   */
  getStatus() {
    return {
      running: this.isRunning,
      interval: this.updateInterval,
      updateFrequency: Math.floor(1000 / this.updateInterval * 60) + ' updates/min',
      uptime: this.isRunning ? 'ativo' : 'inativo'
    };
  }

  /**
   * Controlar velocidade (para testes)
   */
  setUpdateInterval(ms) {
    this.updateInterval = ms;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

// Instância global (será inicializada quando data.js estiver carregado)
let realtimeSimulator = null;

function initRealtimeSimulator() {
  if (!realtimeSimulator && typeof dataSimulator !== 'undefined') {
    realtimeSimulator = new RealtimeSimulator(dataSimulator);
  }
  return realtimeSimulator;
}

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', () => {
  initRealtimeSimulator();
});
