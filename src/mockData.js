/**
 * Mock Data - N Eyes
 * Dados fictícios realistas para demonstração da plataforma
 * Substitua por chamadas reais à API quando disponível
 */

const mockData = {
  // Usuários Fictícios
  users: [
    {
      id: 1,
      name: "João Calheiros",
      email: "joao.calheiros@empresa.com.br",
      role: "ADMIN",
      department: "TI"
    },
    {
      id: 2,
      name: "Maria Silva",
      email: "maria.silva@empresa.com.br",
      role: "USER",
      department: "RH"
    },
    {
      id: 3,
      name: "Haniel Maia",
      email: "haniel.maia@empresa.com.br",
      role: "MODERATOR",
      department: "TI"
    }
  ],

  // Dados de Dispositivos
  devices: [
    { id: 1, ip: '192.168.1.101', hostname: 'Desktop-TI-01', bandwidth: 45.2, status: 'ONLINE', blocked: false, lastSeen: new Date(Date.now() - 2 * 60000) },
    { id: 2, ip: '192.168.1.102', hostname: 'Laptop-Equipe-02', bandwidth: 78.5, status: 'ONLINE', blocked: false, lastSeen: new Date(Date.now() - 1 * 60000) },
    { id: 3, ip: '192.168.1.103', hostname: 'Servidor-Web-01', bandwidth: 234.8, status: 'ONLINE', blocked: false, lastSeen: new Date() },
    { id: 4, ip: '192.168.1.104', hostname: 'Impressora-Rede-03', bandwidth: 12.3, status: 'ONLINE', blocked: false, lastSeen: new Date(Date.now() - 5 * 60000) },
    { id: 5, ip: '192.168.1.105', hostname: 'Mobile-Admin-04', bandwidth: 28.7, status: 'OFFLINE', blocked: false, lastSeen: new Date(Date.now() - 30 * 60000) },
    { id: 6, ip: '192.168.1.106', hostname: 'Laptop-Equipe-05', bandwidth: 61.4, status: 'ONLINE', blocked: false, lastSeen: new Date() },
    { id: 7, ip: '192.168.1.107', hostname: 'Servidor-BD-02', bandwidth: 312.6, status: 'ONLINE', blocked: false, lastSeen: new Date(Date.now() - 3 * 60000) },
    { id: 8, ip: '192.168.1.108', hostname: 'Camera-IP-01', bandwidth: 8.9, status: 'ONLINE', blocked: false, lastSeen: new Date(Date.now() - 10 * 60000) },
    { id: 9, ip: '192.168.1.109', hostname: 'Switch-Core-01', bandwidth: 489.1, status: 'ONLINE', blocked: false, lastSeen: new Date() },
    { id: 10, ip: '192.168.1.110', hostname: 'Desktop-RH-06', bandwidth: 33.5, status: 'OFFLINE', blocked: false, lastSeen: new Date(Date.now() - 45 * 60000) },
    { id: 11, ip: '192.168.1.111', hostname: 'Firewall-Edge-01', bandwidth: 156.3, status: 'ONLINE', blocked: false, lastSeen: new Date(Date.now() - 1 * 60000) },
    { id: 12, ip: '192.168.1.112', hostname: 'NAS-Storage-01', bandwidth: 267.4, status: 'ONLINE', blocked: false, lastSeen: new Date(Date.now() - 2 * 60000) },
  ],

  // Dados de Tráfego (Últimas 12 amostras de 5 minutos)
  trafficSamples: [
    { time: '14:00', download: 180, upload: 90, maliciousScore: 2 },
    { time: '14:05', download: 220, upload: 110, maliciousScore: 5 },
    { time: '14:10', download: 195, upload: 105, maliciousScore: 3 },
    { time: '14:15', download: 260, upload: 130, maliciousScore: 8 },
    { time: '14:20', download: 240, upload: 120, maliciousScore: 4 },
    { time: '14:25', download: 280, upload: 140, maliciousScore: 12 },
    { time: '14:30', download: 245, upload: 128, maliciousScore: 6 },
    { time: '14:35', download: 210, upload: 95, maliciousScore: 3 },
    { time: '14:40', download: 235, upload: 115, maliciousScore: 7 },
    { time: '14:45', download: 265, upload: 135, maliciousScore: 9 },
    { time: '14:50', download: 255, upload: 125, maliciousScore: 5 },
    { time: '14:55', download: 275, upload: 138, maliciousScore: 10 },
  ],

  // Dados de Logs
  logs: [
    { id: 1, timestamp: new Date(Date.now() - 23 * 60000), eventType: 'CONNECTION', origin: '192.168.1.106 | Laptop-Equipe-05', details: 'Dispositivo conectado à rede', user: 'joao.calheiros', severity: 'INFO' },
    { id: 2, timestamp: new Date(Date.now() - 28 * 60000), eventType: 'BLOCK', origin: '192.168.1.107 | Servidor-BD-02', details: 'Dispositivo bloqueado por administrador', user: 'joao.calheiros', severity: 'WARNING' },
    { id: 3, timestamp: new Date(Date.now() - 35 * 60000), eventType: 'SECURITY_ALERT', origin: '192.168.1.103 | Servidor-Web-01', details: 'Tráfego suspeito detectado - Score 45%', user: 'system', severity: 'CRITICAL' },
    { id: 4, timestamp: new Date(Date.now() - 42 * 60000), eventType: 'CONFIG_CHANGE', origin: 'ADMIN_PANEL', details: 'Configurações de rede atualizadas', user: 'joao.calheiros', severity: 'INFO' },
    { id: 5, timestamp: new Date(Date.now() - 60 * 60000), eventType: 'DISCONNECTION', origin: '192.168.1.105 | Mobile-Admin-04', details: 'Dispositivo desconectado da rede', user: 'system', severity: 'INFO' },
    { id: 6, timestamp: new Date(Date.now() - 75 * 60000), eventType: 'LOGIN', origin: 'ADMIN_PANEL', details: 'Usuário autenticado com sucesso', user: 'joao.calheiros', severity: 'INFO' },
    { id: 7, timestamp: new Date(Date.now() - 90 * 60000), eventType: 'RENAME', origin: '192.168.1.101 | Desktop-TI-01', details: 'Nome do dispositivo alterado', user: 'joao.calheiros', severity: 'INFO' },
    { id: 8, timestamp: new Date(Date.now() - 100 * 60000), eventType: 'UNBLOCK', origin: '192.168.1.108 | Camera-IP-01', details: 'Dispositivo desbloqueado', user: 'joao.calheiros', severity: 'INFO' },
    { id: 9, timestamp: new Date(Date.now() - 120 * 60000), eventType: 'SECURITY_ALERT', origin: '192.168.1.102 | Laptop-Equipe-02', details: 'Tentativa de acesso não autorizado', user: 'system', severity: 'ERROR' },
    { id: 10, timestamp: new Date(Date.now() - 150 * 60000), eventType: 'CONNECTION', origin: '192.168.1.111 | Firewall-Edge-01', details: 'Serviço iniciado', user: 'system', severity: 'INFO' },
    { id: 11, timestamp: new Date(Date.now() - 180 * 60000), eventType: 'CONFIG_CHANGE', origin: 'ADMIN_PANEL', details: 'Threshold de alerta modificado para 80%', user: 'joao.calheiros', severity: 'WARNING' },
    { id: 12, timestamp: new Date(Date.now() - 200 * 60000), eventType: 'LOGOUT', origin: 'ADMIN_PANEL', details: 'Sessão do usuário encerrada', user: 'joao.calheiros', severity: 'INFO' },
    { id: 13, timestamp: new Date(Date.now() - 230 * 60000), eventType: 'CONNECTION', origin: '192.168.1.112 | NAS-Storage-01', details: 'Dispositivo conectado à rede', user: 'system', severity: 'INFO' },
    { id: 14, timestamp: new Date(Date.now() - 260 * 60000), eventType: 'SECURITY_ALERT', origin: '192.168.1.109 | Switch-Core-01', details: 'Padrão de tráfego anômalo detectado', user: 'system', severity: 'WARNING' },
    { id: 15, timestamp: new Date(Date.now() - 290 * 60000), eventType: 'CONNECTION', origin: '192.168.1.104 | Impressora-Rede-03', details: 'Dispositivo conectado à rede', user: 'system', severity: 'INFO' },
  ],

  // Métricas do Dashboard
  metrics: {
    downloadCurrent: 245.8,
    uploadCurrent: 128.4,
    devicesConnected: 12,
    devicesTotal: 12,
  },

  // Notificações
  notifications: [
    { id: 1, title: 'Alto consumo de largura de banda', message: 'Dispositivo 192.168.1.101 excedeu 200 Mbps', time: new Date(Date.now() - 2 * 60000), type: 'warning', icon: 'triangle-alert' },
    { id: 2, title: 'Novo dispositivo conectado', message: 'Laptop-Equipe-05 entrou na rede', time: new Date(Date.now() - 15 * 60000), type: 'info', icon: 'monitor-check' },
    { id: 3, title: 'Dispositivo offline', message: 'Impressora-Rede-03 desconectada', time: new Date(Date.now() - 60 * 60000), type: 'error', icon: 'monitor-off' },
    { id: 4, title: 'Relatório semanal pronto', message: 'Análise de tráfego da semana disponível', time: new Date(Date.now() - 120 * 60000), type: 'success', icon: 'chart-no-axes-column' },
  ],
};

// Função para gerar um novo ID único
function generateNewId() {
  return mockData.devices.length > 0 ? Math.max(...mockData.devices.map(d => d.id)) + 1 : 1;
}

// Função para adicionar dispositivo
function addMockDevice(hostname, ip) {
  const newDevice = {
    id: generateNewId(),
    ip: ip || `192.168.1.${mockData.devices.length + 100}`,
    hostname: hostname || `Device-${generateNewId()}`,
    bandwidth: Math.random() * 300,
    status: 'ONLINE',
    blocked: false,
    lastSeen: new Date(),
  };
  mockData.devices.push(newDevice);
  return newDevice;
}

// Função para deletar dispositivo
function deleteMockDevice(id) {
  const index = mockData.devices.findIndex(d => d.id === id);
  if (index > -1) {
    mockData.devices.splice(index, 1);
    return true;
  }
  return false;
}

// Função para atualizar dispositivo
function updateMockDevice(id, updates) {
  const device = mockData.devices.find(d => d.id === id);
  if (device) {
    Object.assign(device, updates);
    return device;
  }
  return null;
}

// Exportar dados e funções
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mockData, addMockDevice, deleteMockDevice, updateMockDevice };
}
