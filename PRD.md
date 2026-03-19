# Product Requirement Document (PRD)
## N Eyes - Saas Monitoramento de Tráfego de Rede

**Versão:** 1.1  
**Data:** 2026-03-18  
**Projeto:** N Eyes  
**Status:** Em Desenvolvimento

---

## 1. Visão Geral do Produto

### 1.1 Descrição Executiva
O **N Eyes** é uma plataforma web SaaS desenvolvida para monitorar, analisar e diagnosticar o tráfego de rede em tempo real. A plataforma identifica padrões de tráfego saudáveis, lentos ou potencialmente maliciosos, ajudando equipes a detectar problemas de desempenho, quedas de serviço e atividades suspeitas antes que impactem os usuários. Com dashboards intuitivos e métricas detalhadas, o sistema oferece visibilidade completa sobre o comportamento do tráfego e a saúde da aplicação.

### 1.2 Objetivo Principal
Fornecer uma solução simples e eficiente para observabilidade e análise de tráfego, permitindo que desenvolvedores e empresas monitorem a saúde de suas aplicações, identifiquem anomalias e tomem decisões baseadas em dados.

---

## 2. Principais Funcionalidades

- 📊 Monitoramento de tráfego em tempo real
- 🛡️ Detecção de tráfego malicioso ou suspeito
- ⚡ Identificação de lentidão e gargalos
- 🚨 Alertas de quedas ou instabilidade
- 📈 Dashboard com métricas e gráficos
- 🌍 Análise de origem do tráfego
- 📋 Sistema completo de logs
- ⚙️ Painel de configurações integrado

---

## 3. Equipe de Desenvolvimento

### 3.1 Integrantes
A equipe responsável pelo desenvolvimento e entrega deste projeto é composta por profissionais experientes:

| Nome | Área |
|--------|------|
| Haniel Maia | Estilização |
| João Calheiros | Estrutura da página |
| Kaua Heronides | Estilização |
| Jesse Alves | Estrutura da página |

- **Repositório:** github.com/hanielmaia/Saas---Monitoramento-de-Tr-fego

---

## 4. Público-Alvo

### 4.1 Personas Primárias
- **Desenvolvedores:** Profissionais que precisam monitorar a saúde de suas aplicações
- **Administradores de TI:** Responsáveis pela gestão da infraestrutura de rede
- **Analistas de Segurança:** Profissionais que monitoram anomalias e ameaças
- **Gerentes de Infraestrutura:** Responsáveis por otimizar recursos de rede

### 4.2 Características do Público-Alvo
- Conhecimento técnico intermediário a avançado
- Necessidade de acesso rápido e intuitivo
- Preferência por interfaces responsivas
- Exigência de confiabilidade e performance

---

## 5. Requisitos Funcionais

### 5.1 Autenticação (login.html)
- [ ] Formulário de login com usuário e senha
- [ ] Validação de credenciais
- [ ] Redirecionamento para Dashboard após login
- [ ] Armazenamento seguro de sessão
- [ ] Botão de logout com confirmação

### 5.2 Dashboard Principal (home.html)
**Descrição:** Página inicial que fornece uma visão holística do status da rede e dispositivos.

**Funcionalidades:**
- [ ] Exibição de status geral da rede (Online/Offline)
- [ ] Cards com métricas em tempo real:
  - Download Atual (Mbps)
  - Upload Atual (Mbps)
  - Dispositivos Conectados (quantidade)
- [ ] Gráfico de tráfego em tempo real com Chart.js (última 1 hora)
- [ ] Tabela de dispositivos recentes com:
  - Endereço IP
  - Nome do Dispositivo
  - Consumo de Banda (Mbps)
  - Status (Online/Offline)
- [ ] Navegação via sidebar para outras seções

### 5.3 Módulo de Dispositivos (devices.html)
**Descrição:** Página dedicada ao gerenciamento e monitoramento de todos os dispositivos da rede.

**Funcionalidades:**
- [x] Tabela com 15 dispositivos conectados (Desktop, Laptop, Servidor, Impressora, Mobile, Câmera IP, Switch, VoIP, NAS, Firewall)
- [x] Informações exibidas por dispositivo:
  - Endereço IP (192.168.1.101–115)
  - Nome do dispositivo
  - Consumo de banda (Mbps)
  - Status (Online / Offline / Bloqueado)
- [x] Botão **Bloquear/Desbloquear** funcional:
  - Modal de confirmação estilizado com ícones contextuais (🔒/🔓 via Lucide SVG)
  - Alterna status para "Bloqueado" (amarelo) e reverte ao original
  - Texto do botão atualiza dinamicamente
- [x] Botão **Renomear** funcional:
  - Modal com campo de texto pré-preenchido com o nome atual
  - Validação de campo vazio
  - Suporte a Enter para confirmar e Escape para cancelar
  - Atualiza o nome na tabela e os aria-labels dos botões
- [ ] Filtros por tipo de dispositivo e status
- [ ] Informações adicionais detalhadas (MAC Address, tempo de conexão)

### 5.4 Sistema de Logs (logs.html)
**Descrição:** Registro detalhado de todas as atividades e eventos da rede.

**Funcionalidades:**
- [ ] Logs de conexão/desconexão de dispositivos
- [ ] Logs de alterações nas configurações
- [ ] Logs de eventos de segurança
- [ ] Filtros avançados:
  - Por data/hora de início e fim
  - Por tipo de evento
  - Busca por palavra-chave (dispositivo, usuário, evento)
- [ ] Atualização de logs em tempo real
- [ ] Interface responsiva com tabelas filtráveis

### 5.5 Painel de Configurações (config.html)
**Descrição:** Central de gerenciamento de preferências e settings da aplicação.

**Funcionalidades:**
- [x] Configurações de monitoramento de rede:
  - Limiar de alerta (slider percentual)
  - Frequência de varredura (1min a 1h)
  - Quarentena automática de dispositivos suspeitos
- [x] Política de rede:
  - Faixa de IP permitida (CIDR)
  - Portas monitoradas
- [x] Retenção de dados:
  - Período de retenção de logs (7 dias a 1 ano)
  - Arquivamento automático
- [x] Políticas de segurança:
  - Política de senhas (comprimento mínimo, maiúsculas, números, caracteres especiais)
  - Sessões de usuário (duração máxima, tentativas de login, 2FA)
- [x] Modais customizados estilizados (substituem alert() nativo) com animações suaves:
  - Fade-in do backdrop com blur
  - Entrada do card com efeito elástico (scale + translateY)
  - Animação de pop no ícone de confirmação
- [ ] Cadastro de novos usuários
- [ ] Gerenciamento de permissões

### 5.6 Confirmação de Logout (logout-confirm.html)
- [ ] Formulário de confirmação de logout
- [ ] Botões de Confirmar e Cancelar
- [ ] Mensagem de despedida

---

## 6. Requisitos Não-Funcionais

### 6.1 Performance
- Carregamento da página em menos de 3 segundos
- Atualização de dados em tempo real (máximo 5 segundos)
- Gráficos responsivos sem travamentos
- Suporte para múltiplos navegadores modernos

### 6.2 Segurança
- Validação de entrada em todos os formulários
- Proteção contra CSRF e XSS
- Armazenamento seguro de sessão
- Comunicação HTTPS em produção

### 6.3 Responsividade
- Interface otimizada para Desktop (1920x1080+)
- Suporte a tablets (1024x768+)
- Design responsivo para telas variadas
- Compatibilidade com navegadores modernos (Chrome, Firefox, Safari, Edge)

### 6.4 Acessibilidade
- Suporte a leitores de tela
- Labels e aria-labels em formulários e botões
- Navegação por teclado
- Contraste adequado de cores

### 6.5 Disponibilidade
- Backup dos dados regularmente
- Recuperação em caso de falhas
- Monitoramento contínuo da aplicação

---

## 7. Fluxo de Usuário

### 7.1 Fluxo de Autenticação
1. Usuário acessa a plataforma (login.html)
2. Insere credenciais (usuário/senha)
3. Sistema valida credenciais
4. Usuário é redirecionado para Dashboard (home.html)

### 7.2 Fluxo Principal de Uso
1. Usuário faz login na plataforma
2. Dashboard é carregado com métricas em tempo real
3. Usuário pode navegar entre seções via sidebar:
   - Dashboard (visualizar métricas)
   - Dispositivos (gerenciar dispositivos conectados)
   - Logs (consultrar histórico de atividades)
   - Configurações (ajustar preferências)
4. Em qualquer seção, usuário pode fazer logout via botão "Sair"

### 7.3 Fluxo de Análise de Tráfego
1. Usuário acessa Dashboard
2. Visualiza métricas em tempo real (Download, Upload, Dispositivos)
3. Consulta gráfico de tráfego com dados da última hora
4. Identifica dispositivos com maior consumo
5. Pode acessar Logs para investigar atividades suspeitas

---

## 8. Stack Técnico

### 8.1 Frontend
- **Linguagem:** HTML5, CSS3, JavaScript
- **Framework CSS:** Bootstrap 5.3.2
- **Gráficos:** Chart.js
- **Ícones:** Lucide Icons (SVG inline) + Emoji complementar
- **Compatibilidade:** Chrome, Firefox, Safari, Edge (versões recentes)

### 8.2 Arquitetura Frontend
- Estrutura baseada em páginas HTML distintas:
  - login.html - Autenticação
  - register.html - Cadastro de novos usuários
  - home.html - Dashboard principal
  - devices.html - Gerenciamento de dispositivos
  - logs.html - Sistema de Logs
  - config.html - Configurações do sistema e políticas de segurança
  - edit-profile.html - Edição de perfil do usuário
  - logout-confirm.html - Confirmação de logout
- Arquivos CSS separados por página para melhor organização
- Componentes reutilizáveis (sidebar, top bar, formulários)

### 8.3 Padrões e Boas Práticas
- Uso de semantic HTML (header, nav, main, aside, section)
- Atributos ARIA para acessibilidade
- Classes CSS descritivas e consistentes
- Design responsivo com media queries

### 8.4 Dados e Comunicação
- Integração com API backend (a ser definida)
- Armazenamento de sessão via localStorage/sessionStorage
- Gráficos em tempo real com atualização via API ou WebSocket

---

## 9. Tecnologias e Dependências

Dependências principais:
- Bootstrap 5.3.2 (via CDN)
- Chart.js (via CDN)
- Lucide Icons (SVG inline)
- Google Fonts: Orbitron + Rajdhani

---

## 10. Timeline e Milestones

| Fase | Descrição | Status |
|------|-----------|--------|
| 1. Estrutura Base | Criar páginas HTML e estilos CSS | Concluído |
| 2. Dashboard | Implementar dashboard com métricas | Em Progresso |
| 3. Dispositivos | Página dedicada com tabela, bloqueio e renomear | Concluído |
| 4. Sistema de Logs | Desenvolver página de logs com filtros | Em Progresso |
| 5. Configurações | Painel de configs e políticas de segurança com modais animados | Concluído |
| 6. Backend | Integração com API de dados | Planejado |
| 7. Testes | Testes de funcionalidade e performance | Planejado |
| 8. Deploy | Lançamento em produção | Planejado |

---

## 11. Critérios de Sucesso

- ✅ Interface consistente em todas as páginas
- ✅ Responsividade em diferentes resoluções
- ✅ Acesso rápido às principais métricas
- ✅ Dashboard intuitivo e de fácil uso
- ✅ Sistema de logs funcional e filtrável
- ✅ Suporte a múltiplos navegadores modernos
- ✅ Documentação clara do código
- ✅ Conformidade com padrões de acessibilidade WCAG

---

## 12. Notas e Considerações

- Priorize a experiência do usuário com interfaces simples e claras
- Mantenha consistência visual em todas as páginas
- Documente mudanças significativas no código
- Teste regularmente em diferentes navegadores e resoluções
- Implemente melhorias de performance conforme necessário