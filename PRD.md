# Product Requirement Document (PRD)
## N Eyes - Saas Monitoramento de Tráfego de Rede

**Versão:** 1.2  
**Data:** 2026-03-22  
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

### 5.1 Autenticação
**Endpoint:** `POST /api/auth/login` | `POST /api/auth/register` | `GET /api/auth/me` | `POST /api/auth/logout`

- [x] Registro de novo usuário com nome, e-mail e senha
- [x] Login com e-mail e senha — retorna JWT + dados do usuário
- [x] Validação de credenciais via bcrypt
- [x] Emissão de JWT com expiração de 8h (assinado com `JWT_SECRET`)
- [x] Sessão persistida na tabela `sessions` (token + `expires_at`)
- [x] Middleware de autenticação via Bearer token em todas as rotas protegidas
- [x] Logout que invalida o token no banco de dados
- [x] `GET /api/auth/me` retorna perfil do usuário autenticado
- [x] Frontend armazena token e dados em `localStorage` (`neyes_token`, `neyes_user`)
- [x] Formulário de login (login.html) com redirecionamento para home.html
- [x] Tela de confirmação de logout (logout-confirm.html) com limpeza do localStorage

### 5.2 Dashboard Principal (home.html)
**Descrição:** Página inicial que fornece uma visão holística do status da rede e dispositivos.

**Funcionalidades:**
- [x] Exibição de status geral da rede (Online/Offline)
- [x] Cards com métricas em tempo real:
  - Download Atual (Mbps)
  - Upload Atual (Mbps)
  - Dispositivos Conectados (quantidade)
- [x] Dois gráficos de linha com Chart.js: tráfego geral e tráfego malicioso
- [x] Dropdown de notificações na top bar
- [x] Dropdown de perfil do usuário populado a partir do `localStorage`
- [x] Navegação via sidebar para todas as seções
- [ ] Tabela de dispositivos recentes com IP, nome, banda e status

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
- [ ] Integração com API (dados reais do banco)
- [ ] MAC Address e tempo de conexão

### 5.4 Sistema de Logs (logs.html)
**Descrição:** Registro detalhado de todas as atividades e eventos da rede.

**Funcionalidades:**
- [x] Interface com tabela de logs e filtros visuais
- [x] Filtros por palavra-chave, intervalo de datas e tipo de evento
- [x] Botões de exportação CSV e PDF (UI implementada)
- [ ] Integração com API para dados reais
- [ ] Atualização em tempo real

**Tipos de eventos suportados pelo schema:** `CONNECTION`, `DISCONNECTION`, `BLOCK`, `UNBLOCK`, `RENAME`, `LOGIN`, `LOGOUT`, `CONFIG_CHANGE`, `SECURITY_ALERT`  
**Severidades:** `INFO`, `WARNING`, `ERROR`, `CRITICAL`

### 5.5 Painel de Configurações (config.html)
**Endpoint:** `GET /api/settings` | `PUT /api/settings`

**Descrição:** Central de gerenciamento de preferências e settings — persiste no banco de dados (modelo singleton).

**Funcionalidades:**
- [x] Seção **Monitoramento de Rede:**
  - Limiar de alerta de banda (slider 0–100%, default 80%)
  - Frequência de varredura (1min a 1h, default 5min)
  - Quarentena automática de dispositivos suspeitos (toggle, default off)
  - Faixa de IP permitida em CIDR (default `192.168.1.0/24`)
  - Portas monitoradas separadas por vírgula (default `80,443,22,3306`)
  - Período de retenção de logs (7 dias a 1 ano, default 30 dias)
  - Arquivamento automático de logs expirados (toggle, default on)
- [x] Seção **Políticas de Segurança:**
  - Comprimento mínimo de senha (default 8)
  - Exigir letra maiúscula (default on)
  - Exigir número (default on)
  - Exigir caractere especial (default off)
  - Duração máxima de sessão em minutos (default 480 = 8h)
  - Máximo de tentativas de login (default 5)
  - Autenticação de dois fatores — 2FA (toggle, default off)
- [x] Modais customizados estilizados (substituem `alert()` nativo) com animações suaves:
  - Fade-in do backdrop com blur
  - Entrada do card com efeito elástico (scale + translateY)
  - Animação de pop no ícone de confirmação
- [x] Integração real com backend via `GET/PUT /api/settings`
- [ ] Gerenciamento de usuários e permissões

### 5.6 Edição de Perfil (edit-profile.html)
**Endpoint:** `PUT /api/users/me`

- [x] Formulário para atualizar nome, e-mail e senha
- [x] Integração real com backend — persiste no banco de dados
- [x] Token JWT enviado no header Authorization

### 5.7 Confirmação de Logout (logout-confirm.html)
**Endpoint:** `POST /api/auth/logout`

- [x] Tela de confirmação antes do logout
- [x] Chama API para invalidar o token no banco
- [x] Limpa `localStorage` (`neyes_token`, `neyes_user`) após logout
- [x] Botões de Confirmar e Cancelar

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

### 8.1 Backend
| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| Runtime | Node.js | — |
| Framework | Express.js | ^5.2.1 |
| ORM | Prisma | ^7.5.0 |
| Autenticação | JSON Web Tokens (`jsonwebtoken`) | ^9.0.3 |
| Hash de senha | `bcrypt` | ^6.0.0 |
| Variáveis de ambiente | `dotenv` | ^17.3.1 |
| CORS | `cors` | ^2.8.6 |
| Dev server | `nodemon` | ^3.1.14 |

### 8.2 Banco de Dados
- **PostgreSQL** via Prisma ORM
- String de conexão padrão: `postgresql://postgres:neyes2026@localhost:5432/n_eyes_db`
- Configurável via variável `DATABASE_URL` no `.env`

### 8.3 Variáveis de Ambiente (`.env`)
| Variável | Descrição | Fallback |
|----------|-----------|----------|
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://postgres:neyes2026@localhost:5432/n_eyes_db` |
| `JWT_SECRET` | Chave de assinatura do JWT | Nenhum — lança erro se ausente |
| `PORT` | Porta do servidor HTTP | `3000` |

### 8.4 Scripts NPM (backend)
| Script | Comando | Descrição |
|--------|---------|-----------|
| `npm run dev` | `nodemon src/server.js` | Servidor com auto-restart |
| `npm start` | `node src/server.js` | Servidor em produção |
| `npm stop` | `npx kill-port 3000` | Encerra a porta 3000 |
| `npm run status` | HTTP check em `:3000/api/health` | Verifica se o servidor está ativo |
| `npm run prisma:generate` | Gera o Prisma Client | — |
| `npm run prisma:migrate` | Executa as migrations | — |

### 8.5 Frontend
| Categoria | Tecnologia |
|-----------|------------|
| Markup | HTML5 semântico |
| Estilização | CSS3 customizado + Bootstrap 5.3.2 (CDN) |
| Scripting | JavaScript vanilla (inline nas páginas) |
| Gráficos | Chart.js (CDN) |
| Ícones | Lucide Icons (SVG inline) |
| Fontes | Rajdhani, Orbitron (Google Fonts) |
| Estado | `localStorage` (`neyes_token`, `neyes_user`) |

### 8.6 Arquitetura Geral
```
Browser (HTML/CSS/JS Vanilla)
        │
        │  HTTP REST (JSON)
        ▼
Express.js (Node.js)
  ├── Middleware: CORS, JSON parser, auth (JWT)
  ├── Rotas: /api/auth, /api/users, /api/settings, /api/health
  ├── Serve arquivos estáticos em /src
  └── Controllers → Services
        │
        │  Prisma ORM
        ▼
   PostgreSQL
```

### 8.7 Padrões e Boas Práticas
- Arquitetura em camadas: Routes → Controllers → Services → Prisma
- Senhas nunca armazenadas em texto puro (bcrypt)
- Sessões invalidadas no banco ao fazer logout (token stateful)
- HTML semântico com atributos ARIA para acessibilidade
- CSS separado por página para melhor organização
- Sidebar e top bar reutilizados em todas as páginas internas

---

## 9. Banco de Dados — Modelo de Dados

### 9.1 Tabela `users`
| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | UUID | PK |
| `name` | String | — |
| `email` | String | Único |
| `password_hash` | String | Hash bcrypt |
| `role` | Enum `Role` | `USER` \| `ADMIN`, default `USER` |
| `created_at` | DateTime | Auto |
| `updated_at` | DateTime | Auto |

### 9.2 Tabela `sessions`
| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | UUID | PK |
| `user_id` | UUID | FK → users (cascade delete) |
| `token` | String | JWT único |
| `expires_at` | DateTime | Expira em 8h |
| `created_at` | DateTime | Auto |

### 9.3 Tabela `devices`
| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | UUID | PK |
| `ip` | String | — |
| `hostname` | String | — |
| `mac_address` | String? | Opcional |
| `bandwidth_usage` | Float | Default 0 |
| `status` | Enum `DeviceStatus` | `ONLINE` \| `OFFLINE` \| `BLOCKED` |
| `blocked` | Boolean | Default false |
| `created_at` / `updated_at` | DateTime | Auto |

### 9.4 Tabela `logs`
| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | UUID | PK |
| `device_id` | UUID? | FK → devices (set null on delete) |
| `user_id` | UUID? | FK → users (set null on delete) |
| `event_type` | Enum `EventType` | `CONNECTION`, `DISCONNECTION`, `BLOCK`, `UNBLOCK`, `RENAME`, `LOGIN`, `LOGOUT`, `CONFIG_CHANGE`, `SECURITY_ALERT` |
| `severity` | Enum `Severity` | `INFO`, `WARNING`, `ERROR`, `CRITICAL` |
| `message` | String | — |
| `created_at` | DateTime | Auto |

### 9.5 Tabela `settings` (singleton)
| Campo | Default | Descrição |
|-------|---------|-----------|
| `alert_threshold` | 80 | % banda para disparar alerta |
| `scan_frequency` | 5 | Minutos entre varreduras |
| `quarantine_enabled` | false | Quarentena automática |
| `allowed_ip_range` | `192.168.1.0/24` | CIDR permitida |
| `monitored_ports` | `80,443,22,3306` | Portas monitoradas |
| `retention_days` | 30 | Retenção de logs (dias) |
| `auto_archive` | true | Arquivamento automático |
| `min_password_length` | 8 | Política de senha |
| `require_uppercase` | true | Política de senha |
| `require_numbers` | true | Política de senha |
| `require_special_chars` | false | Política de senha |
| `max_session_duration` | 480 | Duração máxima de sessão (min) |
| `max_login_attempts` | 5 | Tentativas antes do bloqueio |
| `two_factor_enabled` | false | Toggle de 2FA |

### 9.6 Tabela `traffic_samples`
| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | UUID | PK |
| `captured_at` | DateTime | Auto |
| `download_mbps` | Float | — |
| `upload_mbps` | Float | — |
| `suspicious_score` | Float | Default 0 |

---

## 10. API — Endpoints

### Autenticação (`/api/auth`)
| Método | Rota | Protegida | Descrição |
|--------|------|-----------|-----------|
| `POST` | `/api/auth/register` | Não | Cadastro de novo usuário |
| `POST` | `/api/auth/login` | Não | Login — retorna JWT + usuário |
| `GET` | `/api/auth/me` | Sim | Perfil do usuário autenticado |
| `POST` | `/api/auth/logout` | Sim | Invalida sessão no banco |

### Usuários (`/api/users`)
| Método | Rota | Protegida | Descrição |
|--------|------|-----------|-----------|
| `PUT` | `/api/users/me` | Sim | Atualiza nome, e-mail ou senha |

### Configurações (`/api/settings`)
| Método | Rota | Protegida | Descrição |
|--------|------|-----------|-----------|
| `GET` | `/api/settings` | Sim | Busca configurações (auto-cria se não existir) |
| `PUT` | `/api/settings` | Sim | Salva/atualiza configurações |

### Health Check
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Retorna `{ status: "ok" }` |

---

## 11. Tecnologias e Dependências

**Backend (npm):**
- `express` ^5.2.1
- `@prisma/client` ^7.5.0
- `prisma` ^7.5.0
- `jsonwebtoken` ^9.0.3
- `bcrypt` ^6.0.0
- `dotenv` ^17.3.1
- `cors` ^2.8.6
- `nodemon` ^3.1.14 (dev)

**Frontend (CDN):**
- Bootstrap 5.3.2
- Chart.js
- Lucide Icons (SVG inline)
- Google Fonts: Orbitron + Rajdhani

---

## 12. Timeline e Milestones

| Fase | Descrição | Status |
|------|-----------|--------|
| 1. Estrutura Base | Criar páginas HTML e estilos CSS | ✅ Concluído |
| 2. Dashboard | Dashboard com métricas e gráficos Chart.js | ✅ Concluído |
| 3. Dispositivos | Tabela, bloqueio e renomear com modais | ✅ Concluído |
| 4. Sistema de Logs | Página de logs com filtros (UI) | ✅ Concluído |
| 5. Configurações | Painel de configs e políticas com modais animados | ✅ Concluído |
| 6. Backend — Auth | API REST com JWT, bcrypt, sessões no banco | ✅ Concluído |
| 7. Backend — Settings | API de configurações integrada ao config.html | ✅ Concluído |
| 8. Backend — Perfil | API de edição de perfil integrada ao edit-profile.html | ✅ Concluído |
| 9. Backend — Devices | API de dispositivos com dados reais | 🔄 Planejado |
| 10. Backend — Logs | API de logs com dados reais e filtros | 🔄 Planejado |
| 11. Dashboard Real | Integração do dashboard com dados da API e traffic_samples | 🔄 Planejado |
| 12. Testes | Testes de funcionalidade e performance | 🔄 Planejado |
| 13. Deploy | Lançamento em produção | 🔄 Planejado |

---

## 13. Critérios de Sucesso

- ✅ Interface consistente em todas as páginas
- ✅ Responsividade em diferentes resoluções
- ✅ Acesso rápido às principais métricas
- ✅ Dashboard intuitivo e de fácil uso
- ✅ Sistema de logs funcional e filtrável
- ✅ Suporte a múltiplos navegadores modernos
- ✅ Documentação clara do código
- ✅ Conformidade com padrões de acessibilidade WCAG

---

## 14. Notas e Considerações

- Priorize a experiência do usuário com interfaces simples e claras
- Mantenha consistência visual em todas as páginas
- Documente mudanças significativas no código
- Teste regularmente em diferentes navegadores e resoluções
- Implemente melhorias de performance conforme necessário
- O campo `users.password` referenciado em `users.service.js` deve ser `passwordHash` — corrigir antes de colocar em produção
- As páginas de Devices e Logs ainda utilizam dados mockados; próximo passo é integrá-las com a API real
- O 2FA está disponível como toggle de configuração, mas a implementação da verificação ainda não foi feita