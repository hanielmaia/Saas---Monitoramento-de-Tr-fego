/**
 * N Eyes - App Initialization
 * Inicializa o sistema, configurações e listeners globais
 */

class NEyesApp {
  constructor() {
    this.data = null;
    this.realtime = null;
    this.isInitialized = false;
    this.config = {
      autoStartRealtime: true,
      updateInterval: 5000,
      enableNotifications: true
    };
  }

  /**
   * Inicializar aplicação
   */
  async init() {
    try {
      Logger.info('Inicializando N Eyes App');

      // Aguardar data simulator estar pronto
      await this.waitForDataSimulator();

      this.data = dataSimulator;
      this.realtime = initRealtimeSimulator();
      
      console.log('[NEyesApp] DataSimulator:', typeof this.data, this.data ? 'OK' : 'NULL');
      console.log('[NEyesApp] RealtimeSimulator:', typeof this.realtime, this.realtime ? 'OK' : 'NULL');

      // Carregar configurações salvas
      this.loadConfig();

      // Iniciar simulador de tempo real
      if (this.config.autoStartRealtime) {
        console.log('[NEyesApp] Iniciando simulador de tempo real...');
        this.realtime.start();
        console.log('[NEyesApp] Simulador iniciado');
      }

      // Setup listeners globais
      this.setupGlobalListeners();

      // Inicializar temas
      this.initTheme();

      this.isInitialized = true;
      Logger.info('✓ N Eyes App inicializado com sucesso');

      // Disparar evento global
      window.dispatchEvent(new CustomEvent('neyes:ready', { detail: { app: this } }));

    } catch (error) {
      Logger.error('Erro ao inicializar N Eyes App', error);
    }
  }

  /**
   * Aguardar data simulator estar disponível
   */
  async waitForDataSimulator(timeout = 5000) {
    const startTime = Date.now();
    
    while (!window.dataSimulator && Date.now() - startTime < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!window.dataSimulator) {
      throw new Error('Data simulator não foi inicializado');
    }
  }

  /**
   * Carregar configurações do storage
   */
  loadConfig() {
    const stored = getFromStorage('neyes_config', {});
    this.config = { ...this.config, ...stored };
  }

  /**
   * Salvar configurações no storage
   */
  saveConfig() {
    saveToStorage('neyes_config', this.config);
  }

  /**
   * Setup de listeners globais
   */
  setupGlobalListeners() {
    // Escutar eventos do data simulator
    this.data.subscribe((event, data) => {
      window.dispatchEvent(new CustomEvent(`neyes:${event}`, { detail: data }));
    });

    // Escutar eventos do realtime simulator
    if (this.realtime) {
      console.log('[NEyesApp] Configurando listeners do realtime...');
      
      this.realtime.on('metrics-collected', (data) => {
        console.log('[NEyesApp] Ouviu evento metrics-collected, disparando global event');
        window.dispatchEvent(new CustomEvent('neyes:metrics-collected', { detail: data }));
      });

      this.realtime.on('devices-updated', (data) => {
        console.log('[NEyesApp] Ouviu evento devices-updated, disparando global event');
        window.dispatchEvent(new CustomEvent('neyes:devices-updated', { detail: data }));
      });

      this.realtime.on('alert-triggered', (data) => {
        this.handleAlertTriggered(data);
      });

      this.realtime.on('anomaly-detected', (data) => {
        this.handleAnomalyDetected(data);
      });
      
      console.log('[NEyesApp] Listeners do realtime configurados');
    } else {
      console.warn('[NEyesApp] RealtimeSimulator não foi inicializado!');
    }

    // Detectar mudanças de abas
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        Logger.debug('Aba perdeu foco');
      } else {
        Logger.debug('Aba ganhou foco - sincronizando dados');
        this.syncData();
      }
    });

    Logger.info('✓ Global listeners setup concluído');
  }

  /**
   * Sincronizar dados (útil quando aba ganha foco)
   */
  syncData() {
    if (this.data) {
      window.dispatchEvent(new CustomEvent('neyes:sync-requested', {
        detail: {
          devices: this.data.getDevices(),
          metrics: this.data.getMetrics(),
          logs: this.data.getLogs()
        }
      }));
    }
  }

  /**
   * Handler para alerta disparado
   */
  handleAlertTriggered(alert) {
    Logger.warn('Alerta disparado', alert);

    // Mostrar notificação
    if (this.config.enableNotifications) {
      this.showNotification(
        '⚠️ Alerta de Monitoramento',
        `Limiar de ${alert.type} excedido: ${alert.currentValue.toFixed(2)}`,
        alert.severity
      );
    }

    // Disparar evento global
    window.dispatchEvent(new CustomEvent('neyes:alert-triggered', { detail: alert }));
  }

  /**
   * Handler para anomalia detectada
   */
  handleAnomalyDetected(anomaly) {
    Logger.warn('Anomalia detectada', anomaly);

    if (this.config.enableNotifications) {
      this.showNotification(
        '🔴 Anomalia Detectada',
        `Valor anômalo em ${anomaly.type}: ${anomaly.value.toFixed(2)}`,
        'warning'
      );
    }

    window.dispatchEvent(new CustomEvent('neyes:anomaly-detected', { detail: anomaly }));
  }

  /**
   * Mostrar notificação toast
   */
  showNotification(title, message, type = 'info') {
    // Se browser suporta Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'neyes-' + Date.now(),
        requireInteraction: type === 'critical'
      });
    }

    // Fallback: toast no app
    showToast(`<strong>${title}</strong><br>${message}`, type);
  }

  /**
   * Solicitar permissão de notificação
   */
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          Logger.info('Permissão de notificação concedida');
        }
      });
    }
  }

  /**
   * Inicializar tema (light/dark)
   */
  initTheme() {
    const savedTheme = getFromStorage('neyes_theme', 'light');
    this.setTheme(savedTheme);
  }

  /**
   * Setar tema
   */
  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('bg-dark', 'text-white');
    } else {
      document.documentElement.removeAttribute('data-bs-theme');
      document.body.classList.remove('bg-dark', 'text-white');
    }
    saveToStorage('neyes_theme', theme);
  }

  /**
   * Toggle tema
   */
  toggleTheme() {
    const currentTheme = getFromStorage('neyes_theme', 'light');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * Getters
   */
  getData() {
    return this.data;
  }

  getRealtimeSimulator() {
    return this.realtime;
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      dataAvailable: this.data !== null,
      realtimeRunning: this.realtime ? this.realtime.isRunning : false,
      config: this.config
    };
  }

  /**
   * Controle de simulador
   */
  startRealtime() {
    if (this.realtime) {
      this.realtime.start();
      this.config.autoStartRealtime = true;
      this.saveConfig();
    }
  }

  stopRealtime() {
    if (this.realtime) {
      this.realtime.stop();
      this.config.autoStartRealtime = false;
      this.saveConfig();
    }
  }

  /**
   * Debug
   */
  getDebugInfo() {
    return {
      app: this.getStatus(),
      simulator: this.realtime ? this.realtime.getStatus() : null,
      data: {
        devicesCount: this.data ? this.data.getDevices().length : 0,
        metricsCount: this.data ? this.data.getMetrics().length : 0,
        logsCount: this.data ? this.data.getLogs().length : 0,
        alertsCount: this.data ? this.data.getAlertRules().length : 0
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Instância global
const app = new NEyesApp();
window.neyesApp = app;

// Inicializar automaticamente quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
    Logger.info('✓ App inicializado após DOMContentLoaded');
  });
} else {
  // DOM já está pronto
  app.init();
  Logger.info('✓ App inicializado imediatamente');
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Expor globalmente para debug
window.neyesApp = app;

// Atalho para debug
window.neyesDebug = () => {
  console.table(app.getDebugInfo());
};
