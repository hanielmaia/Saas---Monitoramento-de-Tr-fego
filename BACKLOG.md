# 📋 N Eyes - Product Backlog

**Versão:** 1.0  
**Data de Criação:** 04/05/2026  
**Status Geral:** Em Desenvolvimento

---

## 📊 Resumo do Projeto

Sistema de monitoramento de tráfego de rede com dashboard cyberpunk para visualizar dispositivos conectados, consumo de largura de banda, alertas em tempo real e gerenciamento de acessos.

---

## 🎯 Épicas e User Stories

### 🔴 ÉPICA 1: Gerenciamento de Dispositivos
**Descrição:** Funcionalidades core para visualizar e gerenciar dispositivos da rede

| ID | User Story | Status | Prioridade | Tasks |
|---|---|---|---|---|
| US-001 | Listar dispositivos conectados | ✅ DONE | ALTA | - Renderizar tabela dinâmica<br>- Mostrar IP, nome, consumo, status<br>- Animar entrada de linhas |
| US-002 | Visualizar consumo em Mbps | ✅ DONE | ALTA | - Formatar dados de bandwidth<br>- Atualizar em tempo real<br>- Mostrar unidade correta |
| US-003 | Bloquear/Desbloquear dispositivo | ✅ DONE | ALTA | - Criar botão de ação<br>- Salvar estado no localStorage<br>- Notificar usuário |
| US-004 | Renomear dispositivo | ✅ DONE | ALTA | - Abrir modal/prompt<br>- Validar entrada<br>- Persistir alteração |
| US-005 | Filtrar dispositivos por status | ⬜ TODO | MÉDIA | - Criar dropdown de filtros<br>- Aplicar filtro em tempo real<br>- Mostrar contador |
| US-006 | Filtrar dispositivos por tipo | ⬜ TODO | MÉDIA | - Criar filtro por categoria<br>- Combinar múltiplos filtros<br>- Limpar filtros |
| US-007 | Ordenar tabela por coluna | ⬜ TODO | MÉDIA | - Adicionar ícones de sort<br>- Implementar sort ascendente/descendente<br>- Manter estado |

---

### 📊 ÉPICA 2: Monitoramento em Tempo Real
**Descrição:** Funcionalidades de atualização contínua e alertas

| ID | User Story | Status | Prioridade | Tasks |
|---|---|---|---|---|
| US-008 | Atualizar dados em tempo real | ✅ DONE | ALTA | - Configurar interval de atualização<br>- Sincronizar dados<br>- Suportar manual refresh |
| US-009 | Gerar alertas de alto consumo | ⬜ TODO | ALTA | - Definir limites de consumo<br>- Detectar ultrapassagem<br>- Notificar usuário (toast/banner) |
| US-010 | Histórico de atividades (Logs) | ⬜ TODO | MÉDIA | - Armazenar eventos em localStorage<br>- Exibir em página de logs<br>- Filtrar por data/tipo |
| US-011 | Notificações em dropdown | ✅ DONE | MÉDIA | - Renderizar dropdown<br>- Mostrar últimas notificações<br>- Marcar como lida |
| US-012 | Indicador de status da rede | ✅ DONE | MÉDIA | - Mostrar Online/Offline<br>- Indicador visual (cor)<br>- Atualizar automaticamente |
| US-013 | Gráfico de consumo de rede | ⬜ TODO | BAIXA | - Integrar Chart.js ou similar<br>- Mostrar tendência de 24h<br>- Atualizar dinamicamente |

---

### 🔐 ÉPICA 3: Autenticação e Gerenciamento de Usuários
**Descrição:** Controle de acesso e perfil de usuário

| ID | User Story | Status | Prioridade | Tasks |
|---|---|---|---|---|
| US-014 | Login de usuário | ✅ DONE | ALTA | - Validar credenciais<br>- Armazenar token/sessão<br>- Redirecionar ao dashboard |
| US-015 | Registrar novo usuário | ✅ DONE | ALTA | - Formulário de signup<br>- Validar email/senha<br>- Hash de senha (bcrypt)<br>- Enviar confirmação |
| US-016 | Editar perfil do usuário | ✅ DONE | MÉDIA | - Página de edição<br>- Atualizar dados<br>- Mudar senha |
| US-017 | Logout seguro | ✅ DONE | ALTA | - Confirmação antes de sair<br>- Limpar sessão/token<br>- Redirecionar para login |
| US-018 | Recuperar senha | ⬜ TODO | MÉDIA | - Email de recuperação<br>- Link com token temporário<br>- Reset de senha |
| US-019 | Autenticação de dois fatores (2FA) | ⬜ TODO | BAIXA | - Integrar autenticador (Google Authenticator)<br>- QR Code para setup<br>- Validação no login |
| US-020 | Controle de permissões | ⬜ TODO | MÉDIA | - Criar roles (admin, user)<br>- Restringir funcionalidades<br>- Log de acesso |

---

### ⚙️ ÉPICA 4: Configurações e Preferências
**Descrição:** Personalizações do sistema

| ID | User Story | Status | Prioridade | Tasks |
|---|---|---|---|---|
| US-021 | Definir limites de largura de banda | ⬜ TODO | MÉDIA | - Página de configurações<br>- Input para limites por dispositivo<br>- Salvar no backend |
| US-022 | Alternar tema (Dark/Light) | ⬜ TODO | BAIXA | - Botão de toggle<br>- Armazenar preferência<br>- Aplicar globalmente |
| US-023 | Configurar notificações | ⬜ TODO | BAIXA | - Ativar/Desativar por tipo<br>- Som ou vibração<br>- Salvar preferência |
| US-024 | Exportar dados de dispositivos | ⬜ TODO | BAIXA | - Gerar CSV/PDF<br>- Incluir filtros aplicados<br>- Download automático |
| US-025 | Importar lista de dispositivos | ⬜ TODO | BAIXA | - Upload de arquivo<br>- Validar formato<br>- Adicionar ao banco |

---

### 📈 ÉPICA 5: Relatórios e Analytics
**Descrição:** Análise e visualização de dados históricos

| ID | User Story | Status | Prioridade | Tasks |
|---|---|---|---|---|
| US-026 | Relatório semanal de tráfego | ⬜ TODO | BAIXA | - Agregar dados por dia<br>- Mostrar picos de consumo<br>- Gerar PDF |
| US-027 | Dashboard de estatísticas | ⬜ TODO | BAIXA | - Total de dispositivos<br>- Consumo médio<br>- Tempo uptime |
| US-028 | Gráficos de tendência | ⬜ TODO | BAIXA | - Linha/área chart<br>- Período customizável<br>- Comparação entre períodos |
| US-029 | Alertas históricos | ⬜ TODO | BAIXA | - Filtrar alertas por data<br>- Exibir em página<br>- Exportar relatório |

---

### 🛠️ ÉPICA 6: Melhorias Técnicas
**Descrição:** Performance, segurança e manutenibilidade

| ID | User Story | Status | Prioridade | Tasks |
|---|---|---|---|---|
| US-030 | Otimizar performance do frontend | ⬜ TODO | MÉDIA | - Lazy loading de componentes<br>- Minificar CSS/JS<br>- Cache de dados |
| US-031 | Implementar PWA | ⬜ TODO | BAIXA | - Service Worker<br>- Funcionar offline<br>- Instalável no mobile |
| US-032 | Melhorar UX mobile | ⬜ TODO | MÉDIA | - Responsividade completa<br>- Touch-friendly buttons<br>- Viewport otimizado |
| US-033 | Testes automatizados | ⬜ TODO | MÉDIA | - Unit tests (Jest)<br>- E2E tests (Cypress)<br>- Cobertura >80% |
| US-034 | Documentação técnica | ⬜ TODO | MÉDIA | - README atualizado<br>- Guia de instalação<br>- API documentation |
| US-035 | CI/CD pipeline | ⬜ TODO | BAIXA | - GitHub Actions<br>- Deploy automático<br>- Testes antes de merge |

---

## 🚀 Roadmap por Sprint

### Sprint 1 - MVP
- [x] US-001: Listar dispositivos
- [x] US-002: Visualizar consumo
- [x] US-003: Bloquear/Desbloquear
- [x] US-014: Login
- [x] US-015: Registro

### Sprint 2 - Core Features
- [x] US-004: Renomear dispositivo
- [x] US-008: Tempo real
- [x] US-011: Notificações
- [x] US-016: Editar perfil
- [ ] US-009: Alertas
- [ ] US-010: Logs

### Sprint 3 - Filtros & Relatórios
- [ ] US-005: Filtrar por status
- [ ] US-006: Filtrar por tipo
- [ ] US-007: Ordenar tabela
- [ ] US-026: Relatório semanal
- [ ] US-027: Dashboard stats

### Sprint 4 - Otimizações
- [ ] US-032: Mobile responsivo
- [ ] US-030: Performance
- [ ] US-033: Testes
- [ ] US-034: Documentação

---

## 📊 Métricas de Progresso

| Status | Count | % |
|--------|-------|------|
| ✅ DONE | 11 | 31% |
| 🔄 IN PROGRESS | 0 | 0% |
| ⬜ TODO | 24 | 69% |
| **TOTAL** | **35** | **100%** |

---

## 🎨 Design & UX

- [x] Dashboard layout cyberpunk
- [x] Tabela de dispositivos
- [x] Sidebar navegação
- [ ] Responsividade mobile
- [ ] Modo dark/light

---

## 🔧 Stack Técnico

**Frontend:**
- HTML5 / CSS3 / JavaScript (vanilla)
- Bootstrap 5 (opcional)
- Chart.js (para gráficos)

**Backend:**
- Node.js + Express
- Prisma ORM
- SQLite/PostgreSQL

**Deployment:**
- Vercel (frontend)
- Heroku/Railway (backend)

---

## 📝 Notas Importantes

- Manter compatibilidade com browsers modernos
- Priorizar segurança (validação + sanitização)
- Testar em múltiplos dispositivos
- Documentar mudanças significativas
- Fazer reviews com professor regularmente

---



---

**Última atualização:** 04/05/2026  
**Próxima review:** 11/05/2026
