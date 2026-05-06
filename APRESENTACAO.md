# N Eyes - Monitoramento de Tráfego de Rede
## Guia Técnico para Apresentação do Projeto

---

## 1. Visão Geral

### Objetivo do Sistema

**N Eyes** é um sistema de **monitoramento em tempo real de tráfego de rede** desenvolvido como aplicação web moderna. O projeto visa fornecer aos administradores de rede uma ferramenta intuitiva para:

- **Visualizar dispositivos conectados** com informações detalhadas (IP, hostname, consumo de banda)
- **Monitorar métricas de tráfego** (download, upload, taxa de transferência)
- **Controlar acesso à rede** através de bloqueio/desbloqueio de dispositivos
- **Rastrear atividades** mediante registros de log em tempo real
- **Detectar anomalias** e tentativas de acesso não autorizadas

### Características Principais

- ✅ **Interface responsiva** baseada em Bootstrap 5.3
- ✅ **API RESTful** gerenciada por JSON Server
- ✅ **Comunicação assíncrona** com Fetch API
- ✅ **Atualização em tempo real** sem recarga de página
- ✅ **Arquitetura modular** com ES6 Modules
- ✅ **Separação clara** entre frontend e backend
- ✅ **Renderização dinâmica de DOM** sem uso de `innerHTML` para conteúdo

---

## 2. Arquitetura de Dados (JSON Server)

### Estrutura do db.json

O projeto utiliza **JSON Server** para simular uma API RESTful completa. O arquivo `db.json` armazena os dados em formato JSON com duas principais coleções:

#### 2.1 Coleção "devices"

```json
{
  "devices": [
    {
      "id": 1,
      "ip": "192.168.1.100",
      "hostname": "Laptop-Equipe-01",
      "status": "Online",
      "bandwidth": 45.2,
      "lastSeen": "2026-05-03T14:32:00Z"
    }
  ]
}
```

**Campos:**
- `id`: Identificador único (inteiro)
- `ip`: Endereço IP do dispositivo (string IPv4)
- `hostname`: Nome/identificação do dispositivo (string)
- `status`: Estado atual - pode ser `"Online"`, `"Offline"` ou `"Blocked"` (string)
- `bandwidth`: Consumo atual de banda em Mbps (float)
- `lastSeen`: Timestamp ISO 8601 da última comunicação (string)

**Estados do Dispositivo:**
- `Online`: Dispositivo ativo e conectado à rede
- `Offline`: Dispositivo inativo (sem conexão)
- `Blocked`: Dispositivo bloqueado administrativamente (sem acesso à rede)

#### 2.2 Coleção "logs"

```json
{
  "logs": [
    {
      "id": 1,
      "timestamp": "2026-05-03T14:32:15Z",
      "deviceId": 1,
      "deviceName": "Laptop-Equipe-01",
      "message": "Conexão estabelecida",
      "severity": "info",
      "type": "connection"
    }
  ]
}
```

**Campos:**
- `id`: Identificador único do log (inteiro)
- `timestamp`: Momento do evento em ISO 8601 (string)
- `deviceId`: Referência ao dispositivo (inteiro, chave estrangeira)
- `deviceName`: Nome do dispositivo (desnormalizado para performance)
- `message`: Descrição do evento (string)
- `severity`: Nível de criticidade - `"info"`, `"warning"`, `"error"` (string)
- `type`: Categoria do evento - `"connection"`, `"bandwidth"`, `"security"` (string)

### 2.3 Gerenciamento de Rotas por server.js

O arquivo [server.js](server.js) funciona como servidor Node.js com as seguintes responsabilidades:

#### Inicialização do JSON Server

```javascript
import jsonServer from 'json-server';

const db = JSON.parse(fs.readFileSync('db.json', 'UTF-8'));
const router = jsonServer.router(db);
const app = jsonServer.create();

app.use('/api', router);
```

**O que acontece:**
1. Lê o arquivo `db.json` e o converte em objeto JavaScript
2. Cria um roteador JSON Server com as operações CRUD
3. Monta o roteador no prefixo `/api`

#### Rotas Disponíveis

O JSON Server gera automaticamente as seguintes rotas RESTful:

| Método | Rota | Ação |
|--------|------|------|
| GET | `/api/devices` | Lista todos os dispositivos |
| GET | `/api/devices/:id` | Retorna um dispositivo específico |
| POST | `/api/devices` | Cria novo dispositivo |
| PATCH | `/api/devices/:id` | Atualiza parcialmente um dispositivo |
| DELETE | `/api/devices/:id` | Remove um dispositivo |
| GET | `/api/logs` | Lista todos os logs |
| GET | `/api/logs?deviceId=1` | Filtra logs por dispositivo |

#### Middleware de Arquivos Estáticos

```javascript
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  
  let filePath = path.join(__dirname, req.url);
  // Serve arquivos HTML, CSS, JS, imagens...
  fs.readFile(filePath, (err, content) => { ... });
});
```

**Função:** Serve arquivos estáticos (HTML, CSS, JS, imagens) sem interferir com requisições de API.

**Porta:** O servidor executa na porta `8000` com URLs como:
- Frontend: `http://localhost:8000/src/pages/home.html`
- API: `http://localhost:8000/api/devices`

---

## 3. Comunicação Assíncrona (Fetch API)

### Camada de Serviço - dataService.js

O arquivo [src/dataService.js](src/dataService.js) centraliza toda a comunicação com a API usando a **Fetch API** moderna. Segue o padrão de **Service Layer** para separação de responsabilidades.

### 3.1 Configuração Base

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Centraliza a URL base evitando duplicação em todo o código.

### 3.2 Função de Tratamento de Erros

```javascript
function handleError(operation, error) {
    console.error(`[${operation}] Erro:`, error.message);
    throw {
        operation,
        message: error.message,
        status: error.status || 'unknown'
    };
}
```

**Estratégia:**
- Normaliza erros em um objeto estruturado
- Registra o nome da operação e mensagem
- Facilita debugging com logs padronizados
- Propaga erros com contexto para chamadores

### 3.3 Operação GET - Buscar Dispositivos

```javascript
export async function getDevices() {
    try {
        const response = await fetch(`${API_BASE_URL}/devices`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        handleError('getDevices', error);
    }
}
```

**Fluxo:**
1. **Envia requisição GET** ao servidor
2. **Valida status HTTP** - se não for 2xx, dispara erro
3. **Parse JSON** - converte resposta para objeto JavaScript
4. **Captura erros** - trata falhas de rede, timeout, etc.

**Tratamento de Erros:**
- `fetch` rejeita apenas em casos de falha de rede
- `response.ok` verifica se status está entre 200-299
- Erros HTTP (404, 500, etc.) são detectados explicitamente

### 3.4 Operação POST/PATCH - Atualizar Dados

```javascript
export async function updateDevice(id, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        handleError(`updateDevice(${id})`, error);
    }
}
```

**Detalhes técnicos:**
- **Método PATCH:** Atualização parcial (apenas campos fornecidos)
- **Headers:** Declara conteúdo como JSON
- **Body:** Serializa objeto JavaScript em string JSON
- **Resposta:** Retorna objeto atualizado do servidor

**Uso prático:**
```javascript
// Bloquear um dispositivo
await updateDevice(1, { status: 'Blocked' });

// Renomear dispositivo
await updateDevice(1, { hostname: 'Novo-Nome' });
```

### 3.5 Operação DELETE - Remover Dispositivo

```javascript
export async function deleteDevice(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return { success: true, id };
    } catch (error) {
        handleError(`deleteDevice(${id})`, error);
    }
}
```

**Particularidades:**
- DELETE não requer body
- Retorna objeto de confirmação (não há resposta do servidor)
- Simples mas eficaz para operações de deleção

### 3.6 Agregação de Dados - getTrafficStats()

```javascript
export async function getTrafficStats() {
    try {
        const devices = await getDevices();
        const onlineCount = devices.filter(d => d.status === 'Online').length;
        const totalBandwidth = devices.reduce((sum, d) => sum + d.bandwidth, 0);
        const avgBandwidth = (totalBandwidth / devices.length).toFixed(2);

        return {
            totalDevices: devices.length,
            onlineCount,
            offlineCount: devices.length - onlineCount,
            totalBandwidth: totalBandwidth.toFixed(2),
            avgBandwidth,
            criticalBandwidth: devices.filter(d => d.bandwidth > 200).length
        };
    } catch (error) {
        handleError('getTrafficStats', error);
    }
}
```

**Lógica:**
1. Busca lista de dispositivos via GET
2. **Filtra** dispositivos online usando Array.filter()
3. **Reduz** array para calcular soma de banda (Array.reduce())
4. **Calcula** estatísticas derivadas (média, críticos)
5. Retorna objeto estruturado com métricas

**Exemplo de retorno:**
```javascript
{
  totalDevices: 11,
  onlineCount: 9,
  offlineCount: 2,
  totalBandwidth: "2425.8",
  avgBandwidth: "220.53",
  criticalBandwidth: 3
}
```

### 3.7 Composição de Funções - blockDevice()

```javascript
export async function blockDevice(id) {
    return updateDevice(id, { status: 'Blocked' });
}

export async function unblockDevice(id, previousStatus = 'Online') {
    return updateDevice(id, { status: previousStatus });
}
```

**Padrão:** Wrapping simples para tornar a API mais expressiva.

**Benefício:** Código mais legível:
```javascript
// Ao invés de:
await updateDevice(1, { status: 'Blocked' });

// Podemos usar:
await blockDevice(1);
```

### 3.8 Tratamento de Erros em Contexto

```javascript
// No código que chama dataService.js
async function loadDevices() {
    try {
        devicesData = await getDevices();
        renderDevicesTable();
    } catch (error) {
        console.error('Erro ao carregar dispositivos:', error);
        showErrorMessage('Falha na conexão com servidor');
    }
}
```

**Estratégia em camadas:**
1. **dataService.js:** Trata erros HTTP e validação
2. **Componente (HTML/JS):** Trata erros de negócio e UI

---

## 4. Interface Dinâmica (DOM)

### Princípio de Design

O projeto **evita completamente o uso de `innerHTML`** para inserção de conteúdo dinâmico. Em seu lugar, usa **`document.createElement()`** e **`appendChild()`** para construir elementos de forma segura e eficiente.

**Por que evitar innerHTML?**
- ⚠️ **Risco de XSS:** innerHTML processa HTML, incluindo scripts maliciosos
- 📈 **Performance:** Requisição aciona layout/reflow completo
- 🔄 **Dificuldade:** Mistura estrutura com conteúdo

**Vantagens de createElement + appendChild:**
- ✅ Seguro por padrão (sem parsing de HTML)
- ✅ Mais eficiente (manipulação de nós isolada)
- ✅ Código mais claro e estruturado

### 4.1 Renderização de Tabela de Dispositivos

Arquivo: [src/pages/devices.html](src/pages/devices.html#L525-L585)

#### Passo 1: Limpar Tabela Anterior

```javascript
function renderDevicesTable() {
    devicesTableBody.innerHTML = '';  // Limpa estrutura vazia
    
    devicesData.forEach(device => {
        // Construir linhas...
    });
}
```

**Nota:** Usa `innerHTML = ''` apenas para limpeza (seguro), não para inserção.

#### Passo 2: Criar Estrutura Linha a Linha

```javascript
const row = document.createElement('tr');
row.className = 'device-row';
row.dataset.deviceId = device.id;
```

**Cria:** Tag `<tr>` com classe e atributo customizado
**Resultado HTML:**
```html
<tr class="device-row" data-device-id="1"></tr>
```

#### Passo 3: Criar Células com Conteúdo Dinâmico

```javascript
// Célula 1: Endereço IP
const tdIp = document.createElement('td');
tdIp.className = 'device-ip';
tdIp.textContent = device.ip;  // ← Seguro! Sem parsing HTML
row.appendChild(tdIp);

// Célula 2: Nome do Dispositivo
const tdName = document.createElement('td');
tdName.className = 'device-name';
tdName.textContent = device.hostname;  // ← Texto puro
row.appendChild(tdName);
```

**Importante:** Usa `textContent` ao invés de `innerHTML`
- `textContent`: Insere como texto literal (seguro)
- `innerHTML`: Processa como HTML (risco de XSS)

#### Passo 4: Criar Elementos Compostos

```javascript
// Status com badge visual
const tdStatus = document.createElement('td');
const statusBadge = document.createElement('span');
statusBadge.className = `device-status ${getStatusClass(device.status)}`;
statusBadge.textContent = device.status;  // "Online", "Offline", "Blocked"

tdStatus.appendChild(statusBadge);  // Aninha span dentro de td
row.appendChild(tdStatus);
```

**Estrutura resultante:**
```html
<td>
  <span class="device-status status-online">Online</span>
</td>
```

#### Passo 5: Criar Botões com Event Listeners Preparados

```javascript
// Botão Bloquear/Desbloquear
const btnBlock = document.createElement('button');
btnBlock.className = 'btn-action btn-action-block';
btnBlock.textContent = device.status === 'Blocked' ? 'Desbloquear' : 'Bloquear';
btnBlock.setAttribute('aria-label', 
  `${device.status === 'Blocked' ? 'Desbloquear' : 'Bloquear'} ${device.hostname}`
);

const tdActions = document.createElement('td');
tdActions.className = 'device-actions';
tdActions.appendChild(btnBlock);

// ... adicionar mais botões ...

row.appendChild(tdActions);
```

**Acessibilidade:** Inclui `aria-label` para leitores de tela

#### Passo 6: Adicionar Linha à Tabela

```javascript
devicesTableBody.appendChild(row);
```

**Resultado:** A linha com todos seus filhos é inserida no DOM em uma única operação.

**HTML final gerado:**
```html
<tbody>
  <tr class="device-row" data-device-id="1">
    <td class="device-ip">192.168.1.100</td>
    <td class="device-name">Laptop-Equipe-01</td>
    <td class="device-bandwidth" data-device-id="1">45.2</td>
    <td>
      <span class="device-status status-online">Online</span>
    </td>
    <td class="device-actions">
      <button class="btn-action btn-action-block">Bloquear</button>
      <button class="btn-action btn-action-rename">Renomear</button>
    </td>
  </tr>
  <!-- Próximas linhas... -->
</tbody>
```

### 4.2 Renderização de Tabela de Logs

Mesmo padrão aplicado a logs:

```javascript
function renderLogsTable() {
    logsTableBody.innerHTML = '';
    
    logsData.forEach(log => {
        const row = document.createElement('tr');
        
        const tdTimestamp = document.createElement('td');
        tdTimestamp.textContent = new Date(log.timestamp).toLocaleString();
        row.appendChild(tdTimestamp);
        
        const tdDevice = document.createElement('td');
        tdDevice.textContent = log.deviceName;
        row.appendChild(tdDevice);
        
        // ... mais células ...
        
        logsTableBody.appendChild(row);
    });
}
```

### 4.3 Atualização Parcial - Métricas em Tempo Real

Para performance, o projeto **não re-renderiza a tabela inteira** a cada atualização de banda. Apenas as células com valores mudam:

```javascript
async function updateBandwidthMetrics() {
    const devices = await getDevices();
    const bandwidthCells = document.querySelectorAll('[data-device-id][data-original-bandwidth]');
    
    bandwidthCells.forEach(cell => {
        const deviceId = parseInt(cell.dataset.deviceId);
        const device = devices.find(d => d.id === deviceId);
        
        if (device) {
            const variation = (Math.random() - 0.5) * 0.04;  // ±2%
            const newValue = device.bandwidth * (1 + variation);
            cell.textContent = newValue.toFixed(1);  // Atualiza apenas conteúdo
        }
    });
}
```

**Otimização:**
- Usa `querySelectorAll()` para selecionar células específicas
- Atualiza apenas `textContent` (não re-renderiza HTML)
- Executado a cada 3 segundos sem lag perceptível

---

## 5. Modularização (ESM - ECMAScript Modules)

### Padrão de Modularização

O projeto segue **ES6 Modules** (ESM) para organizar código em componentes reutilizáveis.

### 5.1 Exportação em dataService.js

```javascript
// Exporta cada função individualmente
export async function getDevices() { ... }
export async function updateDevice(id, data) { ... }
export async function deleteDevice(id) { ... }

// Exporta como objeto padrão (alternativa)
export default {
    getDevices,
    updateDevice,
    deleteDevice,
    // ...
};
```

**Duas formas:**
1. **Named exports:** `import { getDevices, updateDevice } from './dataService.js'`
2. **Default export:** `import dataService from './dataService.js'`

### 5.2 Importação em Páginas HTML

```html
<!-- Em devices.html -->
<script type="module">
  import { getDevices, updateDevice, blockDevice } from '../dataService.js';
  
  // Usar funções...
  async function loadDevices() {
      const devices = await getDevices();
      // ...
  }
</script>
```

**Sintaxe:**
- `type="module"` ativa suporte a ES6 Modules
- `import { }` desestrutura funções específicas
- Caminho relativo `../dataService.js`

### 5.3 Separação de Responsabilidades

```
src/
├── dataService.js          ← Camada de Dados (API)
└── pages/
    ├── home.html          ← Lógica de Dashboard
    ├── devices.html       ← Lógica de Dispositivos
    ├── logs.html          ← Lógica de Logs
    └── config.html        ← Lógica de Configurações
```

**Cada página:**
- Importa funções do `dataService`
- Contém lógica de UI específica
- Manipula DOM e eventos

**Benefícios:**
- 📦 **Modular:** Cada arquivo tem responsabilidade clara
- 🔄 **Reutilizável:** dataService é usado por múltiplas páginas
- 🧪 **Testável:** Funções isoladas são fáceis de testar
- 🔧 **Manutenível:** Mudanças em um lugar afetam todos os consumidores

### 5.4 Exemplo de Fluxo Modular

**Requisição de usuario:** Bloquear dispositivo

```
[Página HTML]
  ↓ clica em "Bloquear"
  ↓ captura evento no addEventListener
  ↓ extrai deviceId do data-attribute
  ↓ chama blockDevice(id)
    ↓ [dataService.js]
      ↓ chama updateDevice(id, { status: 'Blocked' })
      ↓ monta requisição FETCH
      ↓ envia PATCH /api/devices/1
        ↓ [JSON Server / Backend]
          ↓ atualiza db.json
          ↓ retorna dispositivo atualizado
        ↓ resposta JSON
      ↓ parse response
      ↓ return dados atualizado
    ↓ retorna promise
  ↓ em then/catch:
  ↓ atualiza devicesData local
  ↓ chama renderDevicesTable()
  ↓ usuário vê mudança na UI
```

---

## 6. Interatividade e Eventos

### 6.1 Captura de Eventos - Delegação

```javascript
document.querySelector('.devices-table').addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-action-block');
    if (!btn) return;
    
    // Processar clique no botão de bloqueio
});
```

**Técnica: Event Delegation**
- Listener em elemento pai (tabela)
- Captura cliques em botões filhos
- Mais eficiente que listeners individuais
- Funciona com elementos adicionados dinamicamente

**Por quê funciona?**
- Eventos "borbulham" do filho para o pai
- `e.target` identifica elemento clicado
- `.closest()` sobe na árvore procurando seletor

### 6.2 Processamento de Clique em "Bloquear"

Arquivo: [src/pages/devices.html](src/pages/devices.html#L650-L705)

#### Passo 1: Capturar Contexto do Clique

```javascript
document.querySelector('.devices-table').addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-action-block');
    if (!btn) return;  // Se não foi clique em botão de bloqueio, ignora
    
    _blockRow = btn.closest('tr');  // Armazena linha para uso posterior
    const deviceId = parseInt(_blockRow.dataset.deviceId);
    const device = devicesData.find(d => d.id === deviceId);
```

**Extrai informações:**
- Identifica linha clicada
- Busca ID do dispositivo
- Localiza objeto na memória

#### Passo 2: Preparar Modal Dinamicamente

```javascript
const isBlocked = device.status === 'Blocked';

if (isBlocked) {
    // Modo de desbloqueio
    modalBlockIcon.textContent = '🔓';
    modalBlockTitle.textContent = 'Desbloquear dispositivo?';
    modalBlockSub.textContent = `O dispositivo "${name}" voltará a ter acesso à rede.`;
    modalBlockConfirm.className = 'dev-modal-btn dev-modal-btn-confirm';
} else {
    // Modo de bloqueio
    modalBlockIcon.textContent = '🔒';
    modalBlockTitle.textContent = 'Bloquear dispositivo?';
    modalBlockSub.textContent = `O dispositivo "${name}" perderá acesso à rede imediatamente.`;
    modalBlockConfirm.className = 'dev-modal-btn dev-modal-btn-danger';
}
```

**Comportamento:**
- Detecta estado atual do dispositivo
- Adapta interface do modal
- Oferece mensagem apropriada

#### Passo 3: Exibir Modal

```javascript
modalBlock.classList.add('open');
modalBlockConfirm.focus();
```

**UX:**
- Mostra modal com confirmação
- Define foco no botão de confirmação
- Usuário precisa confirmar ação

#### Passo 4: Processar Confirmação

```javascript
modalBlockConfirm.addEventListener('click', async function () {
    if (!_blockRow) return;
    
    const deviceId = parseInt(_blockRow.dataset.deviceId);
    const device = devicesData.find(d => d.id === deviceId);
    const isBlocked = device.status === 'Blocked';
    
    try {
        const newStatus = isBlocked ? 'Online' : 'Blocked';
        await updateDevice(deviceId, { status: newStatus });  // ← Requisição API
        
        // Atualizar estado local
        device.status = newStatus;
        renderDevicesTable();  // Re-renderizar tabela
        
        console.log(`✅ Dispositivo ${deviceId} atualizado para ${newStatus}`);
    } catch (error) {
        console.error('❌ Erro ao atualizar dispositivo:', error);
    }
    
    modalBlock.classList.remove('open');
    _blockRow = null;
});
```

**Fluxo:**
1. Alterna status (Online ↔ Blocked)
2. Envia PATCH para API
3. Atualiza dados em memória
4. Re-renderiza tabela
5. Fecha modal
6. Limpa estado

#### Passo 5: Fechar Modal

```javascript
[modalBlockCancel, modalBlock].forEach(el => {
    el.addEventListener('click', function (e) {
        if (e.target === modalBlock || e.target === modalBlockCancel) {
            modalBlock.classList.remove('open');
        }
    });
});
```

**Condição:** Fecha apenas se clicou em X ou fundo, não no conteúdo

### 6.3 Processamento de "Renomear"

Fluxo similar ao bloqueio:

```javascript
document.querySelector('.devices-table').addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-action-rename');
    if (!btn) return;
    
    _renameRow = btn.closest('tr');
    const deviceId = parseInt(_renameRow.dataset.deviceId);
    const device = devicesData.find(d => d.id === deviceId);
    
    // Pré-popular input com nome atual
    modalRenameInput.value = device.hostname;
    modalRename.classList.add('open');
    modalRenameInput.focus();
    modalRenameInput.select();  // Seleciona texto para edição rápida
});
```

**Diferença:** Abre modal com input para digitação

### 6.4 Tratamento de Refresh

```javascript
btnRefresh.addEventListener('click', loadDevices);
```

**Ação:** Recarrega lista de dispositivos da API ao clicar

---

## 7. Monitoramento em Tempo Real

### 7.1 Estratégia de Atualização

O projeto implementa **polling periódico** para simular monitoramento em tempo real:

```javascript
// Atualizar métricas a cada 4 segundos
setInterval(updateDashboardMetrics, 4000);

// Atualizar largura de banda a cada 3 segundos
setInterval(updateBandwidthMetrics, 3000);

// Atualizar dados de tráfego malicioso a cada 5 segundos
setInterval(generateMaliciousTrafficData, 5000);
```

**Vantagem:** Sem necessidade de WebSocket ou Server-Sent Events
**Desvantagem:** Algumas segundos de latência máxima

### 7.2 Atualização de Métricas do Dashboard

Arquivo: [src/pages/home.html](src/pages/home.html#L480-L538)

#### Buscar Dados Atualizados

```javascript
async function updateDashboardMetrics() {
    try {
        const devices = await getDevices();
        const metrics = await getMetrics();
```

**Chamadas:**
- `getDevices()`: Busca lista de dispositivos
- `getMetrics()`: Busca dados de download/upload

#### Calcular Estatísticas

```javascript
const downloadValue = metrics.download * (1 + (Math.random() - 0.5) * 0.1);  // ±5%
const uploadValue = metrics.upload * (1 + (Math.random() - 0.5) * 0.1);

const devicesConnected = devices.filter(d => d.status === 'Online').length;
```

**Simula variação:** Adiciona ±5% de variação aleatória para realismo

#### Atualizar DOM Sem innerHTML

```javascript
const downloadCard = document.getElementById('download-metric');
if (downloadCard) {
    const metricValue = downloadCard.querySelector('.metric-value');
    if (metricValue) {
        metricValue.textContent = downloadValue.toFixed(1);  // ← Seguro
    }
}
```

**Padrão:**
1. Seleciona elemento container
2. Encontra elemento de valor dentro
3. Atualiza `textContent` apenas

**Benefício:** Apenas o valor muda, estrutura HTML permanece intacta

### 7.3 Atualização de Gráficos com Chart.js

```javascript
trafficChart.data.labels.push(currentTime);
if (trafficChart.data.labels.length > 7) {
    trafficChart.data.labels.shift();  // Remove rótulo antigo
}

trafficChart.data.datasets[0].data.push(downloadValue);
if (trafficChart.data.datasets[0].data.length > 7) {
    trafficChart.data.datasets[0].data.shift();  // Remove dado antigo
}

trafficChart.update();  // Re-renderiza gráfico
```

**Lógica:**
- Adiciona novo ponto de dados
- Mantém apenas últimos 7 pontos (janela móvel)
- Remove ponto mais antigo (`shift()`)
- `update()` re-renderiza o gráfico

**Resultado:** Gráfico com histórico rolante dos últimos ~28 minutos

### 7.4 Variação Realista de Dados

```javascript
const variation = (Math.random() - 0.5) * 0.04;  // ±2%
const newValue = originalValue * (1 + variation);
```

**Fórmula:**
- `Math.random()` gera número 0-1
- `(- 0.5)` desloca para -0.5 a 0.5
- `* 0.04` escala para ±2%
- Multiplica valor original

**Exemplo:**
```
Valor original: 45.2 Mbps
Variação aleatória: 1.5% positiva
Novo valor: 45.2 * 1.015 = 45.88 Mbps
```

### 7.5 Fórmula Matemática de Atualização

Para melhor precisão, a atualização é calculada como:

$$V_{novo} = V_{original} \times \left(1 + r\right)$$

Onde:
- $V_{original}$ = valor anterior do métrica
- $r$ = variação aleatória no intervalo $[-p, p]$
- $p$ = porcentagem máxima de variação

Por exemplo, com $p = 0.02$ (2%):
$$r \in [-0.02, 0.02]$$
$$V_{novo} \in [V_{original} \times 0.98, V_{original} \times 1.02]$$

### 7.6 Simulação de Tráfego Malicioso

```javascript
function generateMaliciousTrafficData() {
    const attempts = Math.floor(Math.random() * 40);  // 0-40 tentativas
    
    // Adicionar ao gráfico
    maliciousTrafficChart.data.labels.push(getTimeLabel());
    maliciousTrafficChart.data.datasets[0].data.push(attempts);
    
    // Manter últimas 7 amostras
    if (maliciousTrafficChart.data.labels.length > 7) {
        maliciousTrafficChart.data.labels.shift();
        maliciousTrafficChart.data.datasets[0].data.shift();
    }
    
    maliciousTrafficChart.update();
}
```

**Propósito:** Demonstra rastreamento de tentativas de acesso bloqueado

---

## Conclusão

### Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR (Frontend)                 │
├─────────────────────────────────────────────────────────┤
│                      HTML Pages                          │
│        (home.html, devices.html, logs.html, etc)        │
├─────────────────────────────────────────────────────────┤
│                  ES6 Module Imports                      │
│                   (dataService.js)                       │
├─────────────────────────────────────────────────────────┤
│                   Fetch API Requests                     │
│                  (async/await pattern)                   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼──────────────────────────┐   │
    │   Node.js Server (server.js)  │   │
    │   - Serve static files         │   │
    │   - Mount JSON Server          │   │
    └────────────────────────────────┘   │
         │                               │
    ┌────▼──────────────────────────┐   │
    │  JSON Server Router (/api)     │   │
    │  - GET /devices               │   │
    │  - POST /devices              │   │
    │  - PATCH /devices/:id         │   │
    │  - DELETE /devices/:id        │   │
    │  - GET /logs                  │   │
    └────┬───────────────────────────┘   │
         │                               │
    ┌────▼──────────────────────────┐   │
    │     db.json (Base de Dados)    │   │
    │  - devices: [ {...}, {...} ]   │   │
    │  - logs: [ {...}, {...} ]      │   │
    └────────────────────────────────┘   │
         └───────────────────────────────┘
         Resposta JSON
```

### Padrões de Design Utilizados

1. **Service Layer:** dataService.js centraliza comunicação
2. **Module Pattern:** ES6 Modules para organização
3. **Event Delegation:** Listeners em elementos pai
4. **Reactive Updates:** setInterval para UI em tempo real
5. **Error Handling:** Tratamento estruturado em camadas
6. **DOM Security:** createElement + textContent (não innerHTML)

### Diferenciais Técnicos

✅ **Modularização completa** com ES6 Modules  
✅ **API RESTful funcional** com JSON Server  
✅ **Interface responsiva** com Bootstrap 5  
✅ **Rendering seguro** sem HTML injection risks  
✅ **Performance otimizada** com atualização parcial de DOM  
✅ **UX interativa** com modais e validações  
✅ **Monitoramento em tempo real** com polling e gráficos  

---

**Data:** Maio de 2026  
**Projeto:** N Eyes - Monitoramento de Tráfego de Rede  
**Tecnologias:** Node.js, JSON Server, Fetch API, ES6 Modules, Bootstrap 5, Chart.js
