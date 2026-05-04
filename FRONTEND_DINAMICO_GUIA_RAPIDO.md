# Frontend Dinâmico - Guia Rápido de Início

## 📦 O que foi criado

### Arquivos JavaScript Core

1. **`src/public/js/data.js`** (380 linhas)
   - Simulador de dados com persistência em localStorage
   - Gera dados realistas (dispositivos, métricas, logs)
   - Métodos para CRUD de dispositivos e alertas
   - Base para transição para backend real

2. **`src/public/js/simulator.js`** (200 linhas)
   - Simula coleta em tempo real (como SNMP/WebSocket)
   - Atualiza dados a cada 5 segundos
   - Detecta anomalias (Z-score)
   - Verifica regras de alerta

3. **`src/public/js/utils.js`** (350 linhas)
   - 50+ funções utilitárias
   - Formatação (datas, bandwidth, etc)
   - Validação (email, IP, CIDR)
   - Storage, array manipulation, logger

4. **`src/public/js/app.js`** (250 linhas)
   - Inicializador central da aplicação
   - Setup de event listeners globais
   - Gerenciamento de temas (light/dark)
   - Notificações de alerta e anomalia

5. **`src/public/js/pages/dashboard.js`** (250 linhas)
   - Lógica dinâmica do dashboard
   - Atualização de gráfico Chart.js em tempo real
   - Tabela de dispositivos recentes
   - Cards de métricas com animação

6. **`src/public/js/pages/devices.js`** (200 linhas)
   - Tabela dinâmica de dispositivos
   - Bloquear/desbloquear
   - Renomear dispositivos
   - Filtros e ordenação

7. **`src/public/js/pages/logs.js`** (250 linhas)
   - Tabela de logs com paginação
   - Filtros por tipo e severidade
   - Busca full-text
   - Auto-refresh

### Arquivos de Documentação

- **`INTEGRACAO_FRONTEND_DINAMICO.md`** - Guia detalhado de integração
- **`EXEMPLO_HOME_DINAMICO.html`** - Exemplo prático da página home

---

## ⚡ Quick Start (5 minutos)

### 1. Copiar os 5 scripts principais

```bash
✅ src/public/js/data.js
✅ src/public/js/utils.js  
✅ src/public/js/simulator.js
✅ src/public/js/app.js
✅ src/public/js/pages/dashboard.js
✅ src/public/js/pages/devices.js
✅ src/public/js/pages/logs.js
```

### 2. Adicionar ao home.html (antes de `</body>`)

```html
<script src="/src/public/js/data.js"></script>
<script src="/src/public/js/utils.js"></script>
<script src="/src/public/js/simulator.js"></script>
<script src="/src/public/js/app.js"></script>
<script src="/src/public/js/pages/dashboard.js"></script>
```

### 3. Adicionar IDs aos elementos HTML

```html
<h2 id="metric-download">0 Mbps</h2>
<h2 id="metric-upload">0 Mbps</h2>
<h2 id="metric-devices">0/15</h2>
<h2 id="metric-latency">0 ms</h2>
<canvas id="traffic-chart"></canvas>
```

### 4. Testar

Abrir `home.html` no navegador. Você deve ver:
- ✅ Cards atualizando a cada segundo
- ✅ Gráfico animado com dados
- ✅ Tabela com dispositivos reais

---

## 📊 Funcionalidades por Página

### Dashboard (home.html)
- ✅ Cards com métricas em tempo real
- ✅ Gráfico de tráfego (Download/Upload)
- ✅ Tabela de dispositivos recentes
- ✅ Auto-atualização a cada 1 segundo
- ✅ Notificações de alerta

### Dispositivos (devices.html)
- ✅ Tabela completa de 15 dispositivos
- ✅ Bloquear/desbloquear dinâmico
- ✅ Renomear dispositivos
- ✅ Filtros por status e tipo
- ✅ Ordenação por colunas
- ✅ Status com cores

### Logs (logs.html)
- ✅ Tabela de logs com paginação
- ✅ Filtros por tipo e severidade
- ✅ Busca em tempo real
- ✅ Novos logs aparecem automaticamente
- ✅ Cores por severidade (info/warning/critical)

---

## 🔄 Como os dados funcionam

```
[Simulador] (a cada 5s)
    ↓
[Data Simulator] atualiza dados em memória
    ↓
[Realtime Simulator] dispara eventos
    ↓
[Pages Controllers] escutam eventos e atualizam UI
    ↓
[localStorage] persiste dados
```

### Fluxo de uma métrica

```
1. Simulador coleta métrica fictícia
2. dataSimulator.updateMetrics() adiciona ao histórico
3. realtimeSimulator emite evento 'metrics-collected'
4. window escuta e dispara CustomEvent
5. dashboard.js escuta e atualiza Chart e cards
6. UI anima a mudança
```

---

## 🎮 API de Controle

### No Console do Navegador

```javascript
// Ver status
neyesApp.getDebugInfo()

// Controlar simulador
neyesApp.startRealtime()
neyesApp.stopRealtime()

// Dados
neyesApp.getData().getDevices()
neyesApp.getData().getMetrics()
neyesApp.getData().getLogs()

// Temas
neyesApp.toggleTheme()
neyesApp.setTheme('dark')

// Debug
enableDebugMode()
neyesDebug()

// Ações
neyesApp.getData().blockDevice(1)
neyesApp.getData().renameDevice(1, 'Novo Nome')
```

---

## 📁 Estrutura de Arquivos

```
src/
├── pages/
│   ├── home.html              ← Adicionar scripts aqui
│   ├── devices.html           ← Adicionar scripts aqui
│   ├── logs.html              ← Adicionar scripts aqui
│   └── config.html
├── public/
│   ├── js/
│   │   ├── data.js            ✅ Novo
│   │   ├── utils.js           ✅ Novo
│   │   ├── simulator.js       ✅ Novo
│   │   ├── app.js             ✅ Novo
│   │   └── pages/
│   │       ├── dashboard.js   ✅ Novo
│   │       ├── devices.js     ✅ Novo
│   │       └── logs.js        ✅ Novo
│   └── css/
│       └── ...
└── styles/
    └── ...
```

---

## 🔧 Customização

### Mudar velocidade de atualização

```javascript
// No app.js, linha ~20
this.config = {
  autoStartRealtime: true,
  updateInterval: 5000,  // ← Mudar aqui (em ms)
  enableNotifications: true
};
```

### Mudar quantidade de dispositivos

```javascript
// No data.js, linha ~32
initializeDevices() {
  return [
    // Adicionar mais...
  ];
}
```

### Mudar intervalo de sincronização do UI

```javascript
// No dashboard.js, linha ~22
this.updateInterval = 1000;  // ← Mudar para 2000 = 2 segundos
```

---

## ⚙️ Configurações

### Habilitar/Desabilitar Notificações

```javascript
// No console
neyesApp.config.enableNotifications = false
neyesApp.saveConfig()
```

### Tema Dark Mode

```javascript
// No console
neyesApp.setTheme('dark')
```

### Debug Mode

```javascript
// No console
enableDebugMode()
// Vê todos os logs, eventos, etc
```

---

## 📋 Checklist de Integração

Copiar-colar e marcar conforme completa:

- [ ] Copiar `src/public/js/data.js`
- [ ] Copiar `src/public/js/utils.js`
- [ ] Copiar `src/public/js/simulator.js`
- [ ] Copiar `src/public/js/app.js`
- [ ] Copiar `src/public/js/pages/dashboard.js`
- [ ] Copiar `src/public/js/pages/devices.js`
- [ ] Copiar `src/public/js/pages/logs.js`
- [ ] Adicionar 5 scripts em home.html
- [ ] Adicionar IDs aos cards (metric-download, etc)
- [ ] Adicionar canvas #traffic-chart
- [ ] Testar home.html
- [ ] Adicionar scripts em devices.html
- [ ] Testar devices.html
- [ ] Adicionar scripts em logs.html
- [ ] Testar logs.html
- [ ] Verificar console (F12) sem erros

---

## 🐛 Troubleshooting

### "ReferenceError: dataSimulator is not defined"

**Causa:** `data.js` não foi incluído ou está em posição errada

**Solução:** Adicionar como PRIMEIRO script:
```html
<script src="/src/public/js/data.js"></script>
```

### Gráfico não aparece

**Causa:** `<canvas id="traffic-chart"></canvas>` não existe

**Solução:** Copiar exemplo do arquivo `EXEMPLO_HOME_DINAMICO.html`

### Tabela vazia

**Causa:** Seletores CSS incorretos

**Solução:** Verificar que a tabela tem:
```html
<table class="devices-table">
  <tbody><!-- será preenchida --></tbody>
</table>
```

### Auto-update não funciona

**Causa:** Simulador não iniciou

**Solução:** No console:
```javascript
realtimeSimulator.start()
```

### localStorage cheio

**Solução:** No console:
```javascript
localStorage.clear()
```

---

## 🚀 Próximos Passos

### Curto Prazo (Hoje)
1. ✅ Integrar em home.html
2. ✅ Testar gráfico
3. ✅ Testar atualização em tempo real

### Médio Prazo (Semana)
1. Integrar devices.html com bloquear/renomear
2. Integrar logs.html com filtros
3. Testar em mobile

### Longo Prazo (Mês)
1. Conectar com backend (substituir data.js)
2. WebSocket real (substituir simulator.js)
3. Banco de dados persistente

---

## 📚 Documentação Completa

Para detalhes avançados, ver:
- [INTEGRACAO_FRONTEND_DINAMICO.md](INTEGRACAO_FRONTEND_DINAMICO.md) - Guia completo
- [EXEMPLO_HOME_DINAMICO.html](EXEMPLO_HOME_DINAMICO.html) - Exemplo prático

---

## 📞 Resumo Técnico

| Aspecto | Detalhes |
|--------|----------|
| **Dados** | Mockados em JavaScript + localStorage |
| **Simulação** | SNMP/NetFlow simulado (5s intervalo) |
| **Tempo Real** | Event-driven com CustomEvents |
| **Persistência** | localStorage (até 5MB) |
| **Performance** | 60 métricas em memória, 500 logs |
| **Compatibilidade** | Chrome, Firefox, Safari, Edge (ES6+) |
| **Sem Dependências** | Apenas Bootstrap e Chart.js (já usa) |

---

## 💡 Dicas Importantes

1. **Ordem dos scripts importa!** Seguir exatamente:
   - data.js → utils.js → simulator.js → app.js → page-specific

2. **IDs devem corresponder** ao que JavaScript procura:
   - `id="metric-download"` precisa existir no HTML

3. **localStorage persiste** entre páginas:
   - Fechar e reabrir = dados continuam
   - Limpar = `localStorage.clear()`

4. **Devtools é seu amigo**:
   - F12 → Console → `neyesDebug()`
   - Inspecionar elementos, network, performance

5. **Testar em abas diferentes**:
   - Abrir home.html em 2 abas
   - Mudar dados em uma, ver sincronizar em outra

---

## ✅ Validação Final

Quando tudo estiver funcionando:

```javascript
// No console
neyesApp.getDebugInfo()

// Deve retornar:
{
  app: {
    initialized: true,
    dataAvailable: true,
    realtimeRunning: true,
    config: {...}
  },
  simulator: {
    running: true,
    interval: 5000,
    updateFrequency: '720 updates/min',
    uptime: 'ativo'
  },
  data: {
    devicesCount: 15,
    metricsCount: 60,
    logsCount: 50,
    alertsCount: 0
  }
}
```

Se tudo está `true` → Parabéns! 🎉
