/**
 * N Eyes - Devices Page
 * Gerencia dados dinâmicos de dispositivos
 */

class DevicesController {
  constructor() {
    this.data = null;
    this.realtime = null;
    this.currentSort = { column: 'ip', order: 'asc' };
    this.currentFilter = { status: 'all', type: 'all' };
  }

  init() {
    window.addEventListener('neyes:ready', () => this.setup());
    
    // Se app já estiver pronto
    if (window.neyesApp && window.neyesApp.isInitialized) {
      this.setup();
    }
  }

  setup() {
    this.data = neyesApp.getData();
    this.realtime = neyesApp.getRealtimeSimulator();

    Logger.info('Devices page inicializada');
    this.renderTable();
    this.setupEventListeners();
    this.setupAutoRefresh();
  }

  /**
   * Renderizar tabela de dispositivos
   */
  renderTable() {
    const tbody = document.querySelector('.devices-table tbody');
    if (!tbody) return;

    let devices = this.data.getDevices();

    // Aplicar filtros
    if (this.currentFilter.status !== 'all') {
      devices = devices.filter(d => d.status === this.currentFilter.status);
    }

    if (this.currentFilter.type !== 'all') {
      devices = devices.filter(d => d.type === this.currentFilter.type);
    }

    // Aplicar ordenação
    devices = sortBy(devices, this.currentSort.column, this.currentSort.order);

    // Renderizar linhas com animação escalonada por índice
    tbody.innerHTML = devices.map((device, idx) => `
      <tr class="device-row" data-device-id="${device.id}" style="animation-delay: ${600 + idx * 80}ms;">
        <td class="device-ip">${device.ip}</td>
        <td class="device-name">${device.name}</td>
        <td class="device-bandwidth">
          ${formatBandwidth(device.bandwidth)}
        </td>
        <td class="device-type">
          <span class="badge bg-secondary">${device.type}</span>
        </td>
        <td class="device-status">
          ${getStatusBadge(device.status, device.blocked)}
        </td>
        <td class="device-actions">
          <div class="action-buttons">
            <button class="btn-block" 
              title="${device.blocked ? 'Desbloquear' : 'Bloquear'}"
              onclick="devicesController.toggleBlockDevice(${device.id})">
              ${device.blocked ? 'Desbloquear' : 'Bloquear'}
            </button>
            <button class="btn-rename" 
              title="Renomear"
              onclick="devicesController.openRenameModal(${device.id})">
              Renomear
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    Logger.debug(`Tabela renderizada: ${devices.length} dispositivos`);
  }

  /**
   * Bloquear/Desbloquear dispositivo
   */
  toggleBlockDevice(deviceId) {
    const device = this.data.getDevice(deviceId);
    if (!device) return;

    if (device.blocked) {
      this.data.unblockDevice(deviceId);
      showToast(`✓ ${device.name} desbloqueado`, 'success', 2000);
    } else {
      this.data.blockDevice(deviceId);
      showToast(`✓ ${device.name} bloqueado`, 'warning', 2000);
    }

    this.renderTable();
  }

  /**
   * Abrir modal de renomeação
   */
  openRenameModal(deviceId) {
    const device = this.data.getDevice(deviceId);
    if (!device) return;

    const newName = prompt(`Novo nome para ${device.name}:`, device.name);
    
    if (newName && newName.trim() && newName !== device.name) {
      this.data.renameDevice(deviceId, newName);
      showToast(`✓ Dispositivo renomeado para "${newName}"`, 'success', 2000);
      this.renderTable();
    }
  }

  /**
   * Setup de event listeners
   */
  setupEventListeners() {
    // Botão de refresh
    document.querySelector('.btn-refresh')?.addEventListener('click', () => {
      this.renderTable();
      showToast('Dados sincronizados', 'info', 2000);
    });

    // Filters (se existirem)
    const statusFilter = document.getElementById('filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.currentFilter.status = e.target.value;
        this.renderTable();
      });
    }

    const typeFilter = document.getElementById('filter-type');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.currentFilter.type = e.target.value;
        this.renderTable();
      });
    }

    // Escutar eventos de dispositivos
    window.addEventListener('neyes:device-status-changed', () => {
      Logger.debug('Status de dispositivo mudou');
      this.renderTable();
    });

    window.addEventListener('neyes:device-blocked', () => {
      this.renderTable();
    });

    window.addEventListener('neyes:device-unblocked', () => {
      this.renderTable();
    });

    window.addEventListener('neyes:device-renamed', () => {
      this.renderTable();
    });

    // Escutar atualizações de dispositivos do realtime
    window.addEventListener('neyes:devices-updated', () => {
      this.renderTable();
    });
  }

  /**
   * Auto-refresh da tabela
   */
  setupAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      // Renderizar novamente (dados são atualizados pelo simulator)
      // Mas não fazer rebuild completo se não houver mudanças
      this.renderTable();
    }, 5000); // 5 segundos

    Logger.info('Auto-refresh de dispositivos ativado');
  }

  /**
   * Destruir
   */
  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

// Instância global
const devicesController = new DevicesController();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => devicesController.init());
} else {
  devicesController.init();
}

// Cleanup
window.addEventListener('beforeunload', () => devicesController.destroy());
