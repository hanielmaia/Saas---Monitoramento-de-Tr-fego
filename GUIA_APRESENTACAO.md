# 🎯 Guia de Apresentação - N Eyes (Mock Data)

## ⚡ Status: Pronto para Demonstração 100% Funcional

Este documento explica como usar o sistema **N Eyes** em modo de demonstração com dados simulados. Toda a aplicação funciona com dados fictícios realistas representando um sistema de monitoramento de rede real.

---

## 📋 Inicialização Rápida

### 1️⃣ Iniciar o Backend
```bash
cd backend
npm install  # (se necessário)
npm run dev
```
Servidor rodando em: `http://localhost:3000`

### 2️⃣ Acessar o Frontend
- Abra o navegador
- Navegue para: `http://localhost:3000`
- Você será redirecionado para a página de login

### 3️⃣ Fazer Login (Dados de Demo)
- **Email**: qualquer email (ex: `demo@test.com`)
- **Senha**: qualquer senha (ex: `123456`)
- O sistema está configurado para acesso em modo demo

---

## 🎬 Roteiro de Apresentação Recomendado

### A. Dashboard (home.html)
**Tempo: 2-3 minutos**

1. Após login, você verá o **Dashboard** com:
   - ✅ Métricas em tempo real (Download, Upload, Dispositivos)
   - ✅ Gráfico de Tráfego atualizado
   - ✅ Gráfico de Tráfego Malicioso detectado
   - ✅ Notificações na top bar

2. **Interações possíveis**:
   - Clique no botão de refresh para atualizar dados
   - Observe os gráficos atualizando automaticamente (a cada 10 segundos)
   - Abra o dropdown de notificações (_ícone de bell_)
   - Acesse o perfil do usuário (_ícone de usuário_)

**Falar sobre**: 
> "O dashboard consolida todos os indicadores críticos da rede. Em tempo real, você pode visualizar padrões de tráfego, detectar anomalias e tomar decisões baseadas em dados."

---

### B. Página de Dispositivos (devices.html)
**Tempo: 3-4 minutos**

1. Clique em **"Dispositivos"** na sidebar

2. Você verá uma **tabela dinâmica** com:
   - 12 dispositivos conectados
   - IP dos dispositivos
   - Consumo de banda (Mbps)
   - Status (Online/Offline/Bloqueado)
   - Botões de ação

3. **Demonstre as Funcionalidades**:

   **a) Adicionar Dispositivo:**
   - Clique no botão **"➕ Adicionar Dispositivo"** (acima da tabela)
   - Um novo dispositivo será adicionado e aparecerá na tabela
   - Repita 2-3 vezes para mostrar dinamismo
   - Um log será registrado automaticamente

   **b) Bloquear/Desbloquear Dispositivo:**
   - Clique em "Bloquear" em qualquer linha
   - Modal de confirmação aparecerá
   - Confirme
   - O status muda para "Bloqueado" (cor amarela)
   - Clique novamente para "Desbloquear"

   **c) Renomear Dispositivo:**
   - Clique em "Renomear" em qualquer linha
   - Modal com campo de texto aparecerá
   - Digite um novo nome (ex: "Servidor-Principal")
   - Pressione Enter ou clique "Salvar"
   - O nome atualiza na tabela

   **d) Deletar Dispositivo:**
   - Clique em "Deletar" (botão vermelho)
   - Confirme no diálogo de confirmação
   - O dispositivo desaparece com animação
   - Um evento é registrado nos logs

4. **À medida que você interage**:
   - Bandwidth dos dispositivos varia ligeiramente (atualiza a cada 15 segundos)
   - Eventos são registrados automaticamente nos Logs

**Falar sobre**:
> "A página de Dispositivos permite gerenciar toda a sua rede conectada. Você pode identificar dispositivos suspeitos, bloqueá-los imediatamente ou renomeá-los para melhor organização. Todas as ações são auditadas nos logs de segurança."

---

### C. Página de Logs (logs.html)
**Tempo: 3-4 minutos**

1. Clique em **"Logs"** na sidebar

2. Você verá uma **tabela de eventos** com:
   - Timestamp (data/hora)
   - Tipo de Evento
   - Origem (IP/Dispositivo)
   - Detalhes
   - Usuário responsável
   - Severidade (Info/Aviso/Erro/Crítico)

3. **Demonstre os Filtros**:

   **a) Buscar por Palavra-chave:**
   - No campo "Busca por Palavra-chave", digite: `Conexão`
   - Clique "Aplicar Filtros"
   - A tabela filtra para mostrar apenas eventos de Conexão

   **b) Filtrar por Tipo de Evento:**
   - Limpe a busca
   - No dropdown "Tipo de Evento", selecione: `Conexão`
   - Clique "Aplicar Filtros"
   - Veja apenas eventos desse tipo

   **c) Filtrar por Data:**
   - Deixe data de hoje
   - Clique "Aplicar Filtros"
   - Mostra logs de hoje

   **d) Limpar Filtros:**
   - Clique "Limpar Filtros"
   - Todos os logs retornam à exibição

4. **Demonstre Exportação**:
   - Clique em "Exportar CSV"
   - Um arquivo CSV é baixado
   - Abra para mostrar estrutura dos dados

5. **Observe Auto-atualizações** (a cada 30 segundos):
   - Novos eventos aparecem automaticamente na tabela
   - Você pode ver eventos sendo adicionados em tempo real

**Falar sobre**:
> "Os logs são essenciais para auditoria e compliance. Todo evento na rede é registrado com timestamp e severidade. Os filtros avançados permitem investigações rápidas, e o export em CSV facilita relatórios e análises."

---

### D. Página de Configurações (config.html)
**Tempo: 1-2 minutos**

1. Clique em **"Configurações"** na sidebar

2. Você verá:
   - Parâmetros de Monitoramento:
     - Limiar de alerta de banda (slider)
     - Frequência de varredura
     - CIDR permitido
     - Portas monitoradas
   - Políticas de Segurança:
     - Comprimento mínimo de senha
     - Requisitos de caracteres
     - Duração de sessão
     - 2FA

3. **Demonstre**:
   - Ajuste o slider de "Limiar de alerta"
   - Visualize modais elegantes de confirmação
   - Mostre persistência das configurações

**Falar sobre**:
> "A centralização de configurações permite ajustar políticas de monitoramento e segurança sem tocar em código. As mudanças são imediatas."

---

### E. Perfil do Usuário (edit-profile.html)
**Tempo: 1 minuto**

1. Na top bar, clique no **ícone de usuário**

2. Clique em **"Editar Perfil"**

3. Você pode:
   - Alterar nome
   - Alterar email
   - Alterar senha

4. Salve as mudanças

**Falar sobre**:
> "Cada usuário tem pleno controle sobre sua conta, permitindo manutenção de credenciais seguras."

---

## 🎨 Architectural Highlights

### Estrutura Implementada

```
Frontend (100% Funcional com Mock Data)
├── mockData.js           → Dados fictícios realistas
├── dataService.js        → Camada de Serviço
├── pages/
│   ├── home.html         → Dashboard dinâmico
│   ├── devices.html      → Gerenciador de dispositivos
│   ├── logs.html         → Sistema de logs interativo
│   ├── config.html       → Configurações
│   └── edit-profile.html → Perfil do usuário
└── styles/
    ├── home.css
    ├── logs.css
    └── ... (outros estilos)
```

### Como Funciona

1. **mockData.js**: Define dados iniciais (12 dispositivos, 15 logs, amostras de tráfego)
2. **dataService.js**: Interface reutilizável para CRUDs e filtros
3. **HTML Pages**: Consomem dados via `dataService` e renderizam dinamicamente
4. **Auto-atualização**: Intervalos pré-configurados simulam dados em tempo real

---

## 🐛 Troubleshooting

### "Gráficos não aparecem"
- Certifique-se de que Chart.js estava carregado (verifique no console do navegador)
- Recarregue a página (`Ctrl+R` ou `Cmd+R`)

### "Tabela está vazia"
- Verifique se os scripts mockData.js e dataService.js foram carregados
- Abra o console (`F12`) e procure por erros
- Confirme que o navegador permite JavaScript

### "Não consigo fazer login"
- O sistema está em modo demo, qualquer credencial funciona
- Se não funcionar, verifique se o backend está rodando

### "Mudanças desaparecem após reload"
- **Esperado!** Os dados estão em memória (não persistem em reload)
- Isso é intencional para a fase experimental

---

## 📊 Dados de Demonstração

### Dispositivos Pré-carregados
- Desktop-TI-01 até Desktop-RH-06
- Servidores Web, BD, Firewall
- Câmeras IP, Impressoras, Switches
- Total: 12 dispositivos

### Tipos de Eventos Registrados
- CONNECTION (Conexão)
- DISCONNECTION (Desconexão)
- BLOCK/UNBLOCK (Bloqueio)
- RENAME (Renomeação)
- CONFIG_CHANGE (Alterações)
- SECURITY_ALERT (Alertas)

### Severidades
- INFO (ℹ️): Azul
- WARNING (⚠️): Amarelo
- ERROR (❌): Vermelho
- CRITICAL (❌): Vermelho escuro

---

## 🚀 Próximos Passos (Após Apresentação)

1. **Implementar Backend Real**:
   - Criar endpoints `/api/devices/*`
   - Criar endpoints `/api/logs/*`
   - Conectar a banco de dados PostgreSQL/Prisma

2. **Integração com API**:
   - Substituir `dataService` para chamar backend
   - Implementar autenticação JWT real
   - Adicionar websockets para atualizações em tempo real

3. **Melhorias de UX**:
   - Paginação de logs
   - Cache de dados
   - Suporte a offline-first

---

## ✨ Conclusão

O N Eyes agora apresenta uma experiência **totalmente funcional** durante a apresentação, permitindo aos professores e stakeholders avaliar a interface, interatividade e conceito sem necessidade de backend real em funcionamento.

**Bom luck na apresentação! 🎉**

---

*Desenvolvido em: Abril, 2026*
*Para: Demonstração de N Eyes - SaaS de Monitoramento de Rede*
