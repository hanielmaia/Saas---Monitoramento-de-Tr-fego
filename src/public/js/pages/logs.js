/**
 * N Eyes - Logs Page
 * Gerencia dados dinâmicos de logs
 */

class LogsController {
  constructor() {
    this.data = null;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.currentFilter = {
      type: 'all',
      severity: 'all',
      search: '',
      device: '', // Filtro por IP ou nome do dispositivo
      dateStart: '', // Data de início
      dateEnd: '' // Data de fim
    };
    this.currentSort = { column: 'timestamp', order: 'desc' };
  }

  init() {
    window.addEventListener('neyes:ready', () => this.setup());
    
    if (window.neyesApp && window.neyesApp.isInitialized) {
      this.setup();
    }
  }

  setup() {
    this.data = neyesApp.getData();

    Logger.info('Logs page inicializada');
    this.renderLogs();
    this.renderFilters();
    this.setupEventListeners();
    this.setupAutoRefresh();
  }

  /**
   * Renderizar logs
   */
  renderLogs() {
    let logs = this.data.getLogs(200); // Obter muitos para filtrar

    // Aplicar filtros
    if (this.currentFilter.type !== 'all') {
      logs = logs.filter(l => l.type === this.currentFilter.type);
    }

    if (this.currentFilter.severity !== 'all') {
      logs = logs.filter(l => l.severity === this.currentFilter.severity);
    }

    if (this.currentFilter.search) {
      const q = this.currentFilter.search.toLowerCase();
      logs = logs.filter(l => 
        l.deviceName.toLowerCase().includes(q) ||
        l.deviceIp.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q)
      );
    }

    if (this.currentFilter.device) {
      const q = this.currentFilter.device.toLowerCase();
      logs = logs.filter(l => 
        l.deviceName.toLowerCase().includes(q) ||
        l.deviceIp.toLowerCase().includes(q)
      );
    }

    if (this.currentFilter.dateStart) {
      const startDate = new Date(this.currentFilter.dateStart).getTime();
      logs = logs.filter(l => new Date(l.timestamp).getTime() >= startDate);
    }

    if (this.currentFilter.dateEnd) {
      const endDate = new Date(this.currentFilter.dateEnd);
      endDate.setHours(23, 59, 59, 999); // Incluir todo o dia
      logs = logs.filter(l => new Date(l.timestamp).getTime() <= endDate.getTime());
    }

    // Aplicar ordenação
    logs = sortBy(logs, this.currentSort.column, this.currentSort.order);

    // Calcular paginação
    const totalItems = logs.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    const paginatedLogs = logs.slice(startIdx, endIdx);

    // Renderizar tabela
    const tbody = document.querySelector('.logs-table tbody');
    if (tbody) {
      tbody.innerHTML = paginatedLogs.map(log => `
        <tr class="log-row log-${log.severity}">
          <td class="log-time">${formatDate(log.timestamp)}</td>
          <td class="log-type">
            <span class="badge bg-secondary">${getLogTypeLabel(log.type)}</span>
          </td>
          <td class="log-device">${log.deviceName}</td>
          <td class="log-ip"><code>${log.deviceIp}</code></td>
          <td class="log-message">${log.message}</td>
          <td class="log-severity">${getSeverityBadge(log.severity)}</td>
        </tr>
      `).join('');
    }

    // Renderizar paginação
    this.renderPagination(totalPages);

    Logger.debug(`Logs renderizados: ${paginatedLogs.length}/${totalItems}`);
  }

  /**
   * Renderizar paginação
   */
  renderPagination(totalPages) {
    const paginationEl = document.querySelector('.pagination');
    if (!paginationEl) return;

    if (totalPages <= 1) {
      paginationEl.style.display = 'none';
      return;
    }

    paginationEl.style.display = 'flex';
    const items = [];

    // Botão anterior
    items.push(`
      <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="logsController.goToPage(${this.currentPage - 1}); return false;">
          ← Anterior
        </a>
      </li>
    `);

    // Números de página
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      items.push(`
        <li class="page-item ${this.currentPage === i ? 'active' : ''}">
          <a class="page-link" href="#" onclick="logsController.goToPage(${i}); return false;">
            ${i}
          </a>
        </li>
      `);
    }

    if (totalPages > 5) {
      items.push(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
      items.push(`
        <li class="page-item">
          <a class="page-link" href="#" onclick="logsController.goToPage(${totalPages}); return false;">
            ${totalPages}
          </a>
        </li>
      `);
    }

    // Botão próximo
    items.push(`
      <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="logsController.goToPage(${this.currentPage + 1}); return false;">
          Próximo →
        </a>
      </li>
    `);

    paginationEl.innerHTML = items.join('');
  }

  /**
   * Renderizar filtros
   */
  renderFilters() {
    // Tipos de log únicos
    const allLogs = this.data.getLogs(200);
    const uniqueTypes = [...new Set(allLogs.map(l => l.type))];
    const uniqueSeverities = [...new Set(allLogs.map(l => l.severity))];

    // Filtro de tipo
    const typeFilter = document.getElementById('filter-type');
    if (typeFilter) {
      typeFilter.innerHTML = `
        <option value="all">Todos os tipos</option>
        ${uniqueTypes.map(type => `
          <option value="${type}">${getLogTypeLabel(type)}</option>
        `).join('')}
      `;
      typeFilter.value = this.currentFilter.type;
    }

    // Filtro de severidade
    const severityFilter = document.getElementById('filter-severity');
    if (severityFilter) {
      severityFilter.innerHTML = `
        <option value="all">Todas as severidades</option>
        ${uniqueSeverities.map(severity => `
          <option value="${severity}">
            ${severity === 'info' ? 'ℹ️ Info' : severity === 'warning' ? '⚠️ Aviso' : '🔴 Crítico'}
          </option>
        `).join('')}
      `;
      severityFilter.value = this.currentFilter.severity;
    }
  }

  /**
   * Setup de event listeners
   */
  setupEventListeners() {
    // Refresh button
    document.querySelector('.btn-refresh')?.addEventListener('click', () => {
      this.renderLogs();
      showToast('Logs atualizados', 'info', 2000);
    });

    // Filtro de tipo
    document.getElementById('filter-type')?.addEventListener('change', (e) => {
      this.currentFilter.type = e.target.value;
      this.currentPage = 1;
      this.renderLogs();
    });

    // Filtro de severidade
    document.getElementById('filter-severity')?.addEventListener('change', (e) => {
      this.currentFilter.severity = e.target.value;
      this.currentPage = 1;
      this.renderLogs();
    });

    // Search input (com debounce)
    const searchInput = document.getElementById('filter-search');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        this.currentFilter.search = e.target.value;
        this.currentPage = 1;
        this.renderLogs();
      }, 300));
    }

    // Filtro por dispositivo/IP (com debounce)
    const deviceFilter = document.getElementById('filter-device');
    if (deviceFilter) {
      deviceFilter.addEventListener('input', debounce((e) => {
        this.currentFilter.device = e.target.value;
        this.currentPage = 1;
        this.renderLogs();
      }, 300));
    }

    // Filtro por data de início
    const dateStartFilter = document.getElementById('filter-date-start');
    if (dateStartFilter) {
      dateStartFilter.addEventListener('change', (e) => {
        this.currentFilter.dateStart = e.target.value;
        this.currentPage = 1;
        this.renderLogs();
      });
    }

    // Filtro por data de fim
    const dateEndFilter = document.getElementById('filter-date-end');
    if (dateEndFilter) {
      dateEndFilter.addEventListener('change', (e) => {
        this.currentFilter.dateEnd = e.target.value;
        this.currentPage = 1;
        this.renderLogs();
      });
    }

    // Escutar eventos de logs
    window.addEventListener('neyes:log-added', () => {
      Logger.debug('Novo log adicionado');
      this.renderFilters();
      this.renderLogs();
    });

    window.addEventListener('neyes:device-blocked', () => {
      this.renderLogs();
    });

    window.addEventListener('neyes:device-renamed', () => {
      this.renderLogs();
    });
  }

  /**
   * Ir para página
   */
  goToPage(page) {
    const maxPage = Math.ceil(this.data.getLogs(200).length / this.itemsPerPage);
    if (page >= 1 && page <= maxPage) {
      this.currentPage = page;
      this.renderLogs();
      // Scroll para tabela
      document.querySelector('.logs-table')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Auto-refresh
   */
  setupAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      this.renderLogs();
    }, 10000); // 10 segundos

    Logger.info('Auto-refresh de logs ativado');
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
const logsController = new LogsController();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => logsController.init());
} else {
  logsController.init();
}

// Cleanup
window.addEventListener('beforeunload', () => logsController.destroy());
