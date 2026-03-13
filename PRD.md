# Product Requirement Document (PRD)
## N Eyes - Saas Monitoramento de Tráfego de Rede

**Versão:** 1.0  
**Data:** 2026-03-13  
**Projeto:** N Eyes  
**Status:** Ativo

---

## 1. Visão Geral do Produto

### 1.1 Descrição Executiva
O **N Eyes** é uma plataforma web SaaS que permite monitorar, analisar e gerenciar o tráfego de rede em tempo real. Oferece insights detalhados sobre o consumo de banda, dispositivos conectados e logs de atividades da rede, proporcionando controle e segurança centralizados.

### 1.2 Objetivo Principal
Fornecer aos administradores de rede uma solução intuitiva e poderosa para:
- Monitorar tráfego de rede em tempo real
- Identificar gargalos e anomalias
- Gerenciar dispositivos conectados
- Visualizar histórico e logs de atividades
- Otimizar o desempenho da infraestrutura de rede

---

## 2. Equipe de Desenvolvimento

### 2.1 Integrantes
A equipe responsável pelo desenvolvimento e entrega deste projeto é composta por profissionais experientes:

| Nome | Área |
|--------|------|
| Haniel Maia | Estilização |
| João Calheiros | Estrutura da página |
| Kaua Heronides | Estilização |
| Jesse Alves | Estrutura da página |

- **Repositório:** github.com/hanielmaia/Saas---Monitoramento-de-Tr-fego

---

## 3. Público-Alvo

### 3.1 Personas Primárias
- **Administrador de TI**: Profissional responsável pela gestão da infraestrutura de rede
- **Gerente de Infraestrutura**: Responsável por monitorar e otimizar recursos de rede
- **Analista de Segurança**: Profissional que monitora anomalias e ameaças

### 3.2 Características do Público-Alvo
- Conhecimento técnico intermediário a avançado
- Necessidade de acesso 24/7
- Preferência por interfaces intuitivas e responsivas
- Exigência de confiabilidade e performance

---

## 4. Requisitos Funcionais

### 4.1 Dashboard Principal
**Descrição:** Página inicial que fornece uma visão holística do status da rede.

**Funcionalidades:**
- [ ] Exibição de status geral da rede (Online/Offline)
- [ ] Cards com métricas em tempo real:
  - Download Atual (Mbps)
  - Upload Atual (Mbps)
  - Dispositivos Conectados (quantidade)
- [ ] Gráfico de tráfego em tempo real (última 1 hora)
- [ ] Tabela de dispositivos recentes com:
  - Endereço IP
  - Nome do Dispositivo
  - Consumo de Banda (Mbps)
  - Status (Online/Offline)

### 4.2 Módulo de Dispositivos
**Descrição:** Gerenciamento e monitoramento de todos os dispositivos da rede.

**Funcionalidades:**
- [ ] Lista completa de dispositivos conectados
- [ ] Filtros por tipo de dispositivo, status e grupo
- [ ] Informações detalhadas:
  - IP e MAC Address
  - Tipo de dispositivo
  - Banda utilizada (download/upload)
  - Tempo de conexão
  - Localização na rede
- [ ] Ações:
  - Bloquear/desbloquear dispositivo
  - Definir limites de banda
  - Renomear dispositivo

### 4.3 Sistema de Logs
**Descrição:** Registro detalhado de todas as atividades e eventos da rede.

**Funcionalidades:**
- [ ] Logs de conexão/desconexão de dispositivos
- [ ] Logs de alterações nas configurações
- [ ] Logs de eventos de segurança
- [ ] Filtros avançados:
  - Por data/hora
  - Por tipo de evento
  - Por dispositivo
  - Por usuário
- [ ] Exportação de logs (CSV, PDF)
- [ ] Busca em tempo real

### 4.4 Painel de Configurações
**Descrição:** Central de gerenciamento de preferências e políticas.

**Funcionalidades:**
- [ ] Configurações de usuário:
  - Perfil
  - Preferências de tema
  - Notificações
- [ ] Configurações de rede:
  - IP da rede
  - Limites de banda globais
  - Políticas de acesso
- [ ] Gerenciamento de usuários:
  - Criar/editar/remover usuários
  - Definir permissões (Admin, Operador, Visualizador)
  - Histórico de atividades
- [ ] Alertas e notificações:
  - Configurar gatilhos
  - Canais de notificação (Email, SMS)
  - Limites críticos

---

## 5. Requisitos Não-Funcionais

### 5.1 Performance
- Carregamento da página em menos de 2 segundos
- Atualização de dados em tempo real (máximo 5 segundos)
- Suporte para até 10,000 dispositivos simultâneos
- Gráficos responsivos sem travamentos

### 5.2 Segurança
- Autenticação por JWT com refresh tokens
- Criptografia TLS 1.3 para todas as comunicações
- Validação de entrada em todos os endpoints
- Proteção contra CSRF e XSS
- Rate limiting para prevenção de ataques

### 5.3 Escalabilidade
- Arquitetura baseada em microsserviços
- Suporte a múltiplas instâncias de API
- Cache distribuído (Redis)
- Banco de dados com replicação

### 5.4 Disponibilidade
- SLA de 99.9% uptime
- Backup automático diário
- Recuperação de desastres em máximo 1 hora
- Monitoramento 24/7

### 5.5 Responsividade
- Interface otimizada para Desktop (1920x1080+)
- Suporte a tablets (1024x768+)
- Design mobile-first para telas pequenas
- Testes em browsers modernos (Chrome, Firefox, Safari, Edge)

---

## 6. Fluxo de Usuário

### 6.1 Fluxo de Autenticação
1. Usuário acessa a plataforma
2. Insere credenciais (email/senha)
3. Sistema valida credenciais
4. Token JWT é gerado
5. Usuário é redirecionado para Dashboard

### 6.2 Fluxo de Monitoramento em Tempo Real
1. Usuário acessa Dashboard
2. Sistema se conecta ao servidor de dados via WebSocket
3. Métricas são atualizadas a cada 5 segundos
4. Gráfico é atualizado incrementalmente
5. Alertas aparecem se limiares são ultrapassados

### 6.3 Fluxo de Gerenciamento de Dispositivos
1. Usuário navega para "Dispositivos"
2. Lista todos os dispositivos conectados
3. Usuário seleciona um dispositivo
4. Detalhes e opções aparecem
5. Usuário pode bloquear, configurar ou renomear

---

## 7. Arquitetura Técnica

### 7.1 Stack Frontend
- **Framework:** React 18+
- **Estilização:** TailwindCSS
- **UI Icons:** Lucide Icons
- **Gráficos:** Chart.js ou Recharts
- **Estado:** Redux Toolkit ou Zustand
- **HTTP Client:** Axios
- **Autenticação:** JWT
- **WebSocket:** Socket.io

### 7.2 Stack Backend
- **Linguagem:** Node.js + Express (ou Python/FastAPI)
- **Banco de Dados:** PostgreSQL
- **Cache:** Redis
- **Message Broker:** RabbitMQ ou Kafka
- **Autenticação:** JWT
- **Logging:** ELK Stack

### 7.3 Infraestrutura
- **Cloud:** AWS ou Azure
- **Containerização:** Docker
- **Orquestração:** Kubernetes
- **CI/CD:** GitHub Actions ou GitLab CI
- **Monitoramento:** Prometheus + Grafana

