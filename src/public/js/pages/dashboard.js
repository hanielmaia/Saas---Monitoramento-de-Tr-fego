/**
 * N Eyes - Dashboard (home.html)
 * Gerencia dados dinâmicos do dashboard
 */

class DashboardController {
  constructor() {
    this.data = null;
    this.realtime = null;
    this.chart = null;
    this.updateInterval = 1000; // Atualizar UI a cada segundo
    this.listeners = [];
  }

  init() {
    console.log('[Dashboard.init] Inicializando dashboard controller...');
    
    // Aguardar app estar pronto
    window.addEventListener('neyes:ready', () => {
      console.log('[Dashboard.init] Evento neyes:ready disparado');
      this.data = neyesApp.getData();
      this.realtime = neyesApp.getRealtimeSimulator();

      console.log('[Dashboard.init] Data e realtime atribuídos');
      Logger.info('Dashboard inicializado');
      this.setupChart();
      this.setupEventListeners();
      this.updateMetrics();
      this.startAutoUpdate();
    });

    // Se app já estiver pronto
    if (window.neyesApp && window.neyesApp.isInitialized) {
      console.log('[Dashboard.init] App já estava pronto, inicializando agora');
      this.data = neyesApp.getData();
      this.realtime = neyesApp.getRealtimeSimulator();

      Logger.info('Dashboard inicializado (app já estava pronto)');
      this.setupChart();
      this.setupEventListeners();
      this.updateMetrics();
      this.startAutoUpdate();
    } else {
      console.log('[Dashboard.init] App ainda não está pronto, aguardando...');
    }
  }

  /**
   * Setup do gráfico Chart.js
   */
  setupChart() {
    console.log('[Dashboard.setupChart] Iniciando setup do gráfico...');
    const canvas = document.getElementById('traffic-chart');
    console.log('[Dashboard.setupChart] Canvas encontrado:', canvas ? 'SIM' : 'NÃO');
    
    if (!canvas) {
      console.error('[Dashboard.setupChart] Canvas não foi encontrado!');
      return;
    }

    const ctx = canvas.getContext('2d');
    const metrics = this.data.getMetrics();
    console.log('[Dashboard.setupChart] Métricas carregadas:', metrics.length);

    const labels = metrics.map(m => formatTime(m.timestamp));
    const downloadData = metrics.map(m => m.download);
    const uploadData = metrics.map(m => m.upload);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Download',
            data: downloadData,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: 'Upload',
            data: uploadData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: { size: 14 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' Mbps';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value + ' Mbps';
              }
            },
            grid: {
              drawBorder: false,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    Logger.info('Gráfico inicializado com ' + metrics.length + ' pontos de dados');
  }

  /**
   * Atualizar métricas (cards)
   */
  updateMetrics() {
    const metrics = this.data.getMetrics();
    if (metrics.length === 0) return;

    const latest = metrics[metrics.length - 1];
    const devices = this.data.getDevices();

    // Download - buscar dentro do card com ID download-metric
    const downloadCard = document.getElementById('download-metric');
    if (downloadCard) {
      const downloadEl = downloadCard.querySelector('.metric-value');
      if (downloadEl) {
        downloadEl.textContent = formatBandwidth(latest.download);
        downloadCard.classList.add('animate-update');
      }
    }

    // Upload - buscar dentro do card com ID upload-metric
    const uploadCard = document.getElementById('upload-metric');
    if (uploadCard) {
      const uploadEl = uploadCard.querySelector('.metric-value');
      if (uploadEl) {
        uploadEl.textContent = formatBandwidth(latest.upload);
        uploadCard.classList.add('animate-update');
      }
    }

    // Dispositivos conectados
    const devicesCard = document.getElementById('devices-metric');
    if (devicesCard) {
      const devicesEl = devicesCard.querySelector('.metric-value');
      if (devicesEl) {
        const onlineCount = devices.filter(d => d.status === 'online').length;
        devicesEl.textContent = onlineCount + '/' + devices.length;
        devicesCard.classList.add('animate-update');
      }
    }

    // Remover classe de animação após 300ms
    setTimeout(() => {
      document.querySelectorAll('.metric-card').forEach(el => {
        el.classList.remove('animate-update');
      });
    }, 300);

    this.updateRecentDevices();
  }

  /**
   * Atualizar tabela de dispositivos recentes
   */
  updateRecentDevices() {
    const tbody = document.querySelector('.devices-table tbody');
    if (!tbody) return;

    const devices = this.data.getDevices().slice(0, 5);
    
    tbody.innerHTML = devices.map(device => `
      <tr class="device-row" data-device-id="${device.id}">
        <td><span class="device-icon">${getDeviceIcon(device.type)}</span></td>
        <td class="device-ip">${device.ip}</td>
        <td class="device-name">${device.name}</td>
        <td class="bandwidth">${formatBandwidth(device.bandwidth)}</td>
        <td>${getStatusBadge(device.status, device.blocked)}</td>
      </tr>
    `).join('');

    Logger.debug('Tabela de dispositivos recentes atualizada', devices.length);
  }

  /**
   * Setup de event listeners
   */
  setupEventListeners() {
    // Botão de refresh
    document.querySelector('.btn-refresh')?.addEventListener('click', () => {
      this.updateMetrics();
      showToast('Dados sincronizados', 'info', 2000);
    });

    // Escutar evento de métricas coletadas
    window.addEventListener('neyes:metrics-collected', (e) => {
      const detail = e.detail;
      console.log('[Dashboard] Ouviu neyes:metrics-collected:', detail);
      Logger.debug('Métrica coletada', detail);

      // Atualizar gráfico
      if (this.chart) {
        console.log('[Dashboard] Atualizando gráfico com:', detail.download, detail.upload);
        this.chart.data.labels.push(formatTime(detail.timestamp));
        this.chart.data.datasets[0].data.push(detail.download);
        this.chart.data.datasets[1].data.push(detail.upload);

        // Manter apenas últimos 60 pontos
        if (this.chart.data.labels.length > 60) {
          this.chart.data.labels.shift();
          this.chart.data.datasets[0].data.shift();
          this.chart.data.datasets[1].data.shift();
        }

        this.chart.update('none'); // Atualizar sem animação
        console.log('[Dashboard] Gráfico atualizado');
      } else {
        console.warn('[Dashboard] Gráfico não foi inicializado');
      }

      this.updateMetrics();
    });

    // Escutar eventos de dispositivos
    window.addEventListener('neyes:devices-updated', (e) => {
      console.log('[Dashboard] Ouviu neyes:devices-updated');
      Logger.debug('Dispositivos atualizados');
      this.updateRecentDevices();
    });

    // Escutar alertas
    window.addEventListener('neyes:alert-triggered', (e) => {
      const alert = e.detail;
      Logger.warn('Alerta disparado no dashboard', alert);

      // Mostrar notificação
      showToast(
        `<strong>⚠️ Alerta!</strong><br>
        ${alert.type}: ${alert.currentValue.toFixed(2)} > ${alert.threshold}`,
        'warning'
      );
    });
    
    console.log('[Dashboard] Event listeners configurados com sucesso');
  }

  /**
   * Iniciar auto-atualização da UI
   */
  startAutoUpdate() {
    this.intervalId = setInterval(() => {
      this.updateMetrics();
      this.updateGraphFromData();
    }, this.updateInterval);

    Logger.info('Auto-atualização iniciada (intervalo: ' + this.updateInterval + 'ms)');
  }

  /**
   * Atualizar gráfico diretamente dos dados (sincronização garantida)
   */
  updateGraphFromData() {
    if (!this.chart || !this.data) return;

    const metrics = this.data.getMetrics();
    const latest = metrics[metrics.length - 1];
    
    // Se o ponto já existe no gráfico, não adicionar novamente
    const lastLabel = this.chart.data.labels[this.chart.data.labels.length - 1];
    const lastTime = formatTime(latest.timestamp);
    
    if (lastLabel === lastTime) {
      return; // Já foi adicionado
    }

    this.chart.data.labels.push(lastTime);
    this.chart.data.datasets[0].data.push(latest.download);
    this.chart.data.datasets[1].data.push(latest.upload);

    // Manter apenas últimos 60 pontos
    if (this.chart.data.labels.length > 60) {
      this.chart.data.labels.shift();
      this.chart.data.datasets[0].data.shift();
      this.chart.data.datasets[1].data.shift();
    }

    this.chart.update('none'); // Atualizar sem animação
    console.log('[Dashboard] Gráfico sincronizado com dados:', latest);
  }

  /**
   * Parar auto-atualização
   */
  stopAutoUpdate() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      Logger.info('Auto-atualização parada');
    }
  }

  /**
   * Destruir
   */
  destroy() {
    this.stopAutoUpdate();
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

// Inicializar quando DOM estiver pronto
const dashboard = new DashboardController();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => dashboard.init());
} else {
  dashboard.init();
}

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
  dashboard.destroy();
});
