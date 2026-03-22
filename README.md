# N Eyes

Plataforma web de monitoramento de tráfego de rede com foco em visualização operacional, acompanhamento de dispositivos conectados e organização de eventos da infraestrutura.

O projeto foi desenvolvido como trabalho acadêmico para a disciplina de Desenvolvimento Web e apresenta uma interface SaaS voltada para cenários de observabilidade de rede, com navegação entre dashboard, dispositivos, logs, configurações e perfil do usuário.


## Visão geral

O N Eyes foi pensado para centralizar, em uma única interface, informações importantes sobre o comportamento da rede. A proposta da aplicação é permitir que o usuário acompanhe indicadores de tráfego, visualize dispositivos ativos, consulte registros de eventos e ajuste políticas operacionais em um painel com linguagem visual consistente.

O projeto conta hoje com backend próprio em Node.js, API REST com autenticação via JWT, banco de dados PostgreSQL gerenciado pelo Prisma ORM e integração real entre frontend e backend nos fluxos de autenticação, configurações e perfil de usuário.

## O que a aplicação entrega hoje

- 📊 Dashboard com métricas de download, upload e dispositivos conectados
- 📈 Gráfico de tráfego com visualização operacional da rede
- ➡️ Menu lateral para navegação entre os módulos principais
- 🔔 Central de notificações e menu de perfil no topo da interface
- 🖥️ Página de dispositivos com tabela detalhada e ações de bloqueio/desbloqueio e renomeação
- 📜 Página de logs com filtros visuais, paginação e organização dos registros
- ⚙️ Painel administrativo com parâmetros de monitoramento, retenção e políticas de segurança — integrado à API
- 📝 Tela de edição de perfil do usuário — integrada à API
- 📁 Fluxos de login, cadastro e confirmação de logout — integrados à API com JWT e sessões reais

## Estrutura das telas

### 1. Autenticação

- `login.html`: acesso ao sistema — autentica via `POST /api/auth/login` e armazena o token em `localStorage`
- `register.html`: criação de conta — envia dados para `POST /api/auth/register`
- `logout-confirm.html`: confirmação de encerramento de sessão — invalida o token no banco via `POST /api/auth/logout`

### 2. Operação e monitoramento

- `home.html`: dashboard principal com indicadores e visão geral da rede
- `devices.html`: gestão dos dispositivos conectados
- `logs.html`: consulta de eventos e registros operacionais
- `config.html`: configurações administrativas da plataforma — lê e salva via `GET/PUT /api/settings`
- `edit-profile.html`: atualização de dados do usuário — integrada via `PUT /api/users/me`

## Principais recursos por módulo

### Autenticação e sessão

- Registro e login com validação de senha via bcrypt
- Emissão de JWT com expiração de 8 horas
- Sessão persistida no banco de dados para permitir logout real (invalidação de token)
- Todas as rotas protegidas verificam o token via middleware

### Dashboard

- Exibe status geral da rede
- Apresenta métricas principais de tráfego
- Mostra gráficos com comportamento de uso e tráfego suspeito
- Reúne alertas e atalhos para ações rápidas

### Dispositivos

- Lista dispositivos com IP, nome, consumo e status
- Permite bloquear e desbloquear dispositivos pela interface
- Permite renomear dispositivos com confirmação em modal

### Logs

- Organiza eventos de rede em formato de tabela
- Disponibiliza filtros por período, tipo e palavra-chave
- Estrutura a experiência para inspeção e leitura operacional dos registros

### Configurações

- Centraliza parâmetros de monitoramento de rede (limiar de alerta, frequência de varredura, quarentena, CIDR, portas)
- Define regras de retenção de logs e arquivamento automático
- Reúne políticas de segurança e sessão (senha, 2FA, tentativas de login, duração de sessão)
- Persiste todas as configurações no banco de dados via API
- Utiliza modais personalizados para feedback de ações

## Tecnologias utilizadas

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5.3.2
- Chart.js
- Lucide Icons
- Google Fonts (Orbitron, Rajdhani)

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcrypt

## Estrutura do repositório

```
├── src/
│   ├── pages/       # Páginas HTML da interface
│   ├── styles/      # Arquivos CSS por página
│   └── public/      # Arquivos públicos estáticos
└── backend/
    ├── prisma/      # Schema e migrations do banco de dados
    └── src/
        ├── config/        # Configuração do Prisma
        ├── controllers/   # Lógica de cada rota
        ├── middlewares/   # Autenticação JWT
        ├── routes/        # Definição das rotas da API
        └── services/      # Regras de negócio
```

## Como executar

### Pré-requisitos

- Node.js instalado
- PostgreSQL em execução
- Variáveis de ambiente configuradas no arquivo `backend/.env`:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/n_eyes_db
JWT_SECRET=sua_chave_secreta
PORT=3000
```

### Backend

```bash
cd backend
npm install
npm run prisma:migrate   # cria as tabelas no banco
npm run dev              # inicia o servidor com hot-reload
```

O servidor sobe em `http://localhost:3000`. A rota `GET /api/health` confirma que está ativo.

### Frontend

Com o backend em execução, o próprio Express serve o frontend. Acesse `http://localhost:3000` no navegador e você será redirecionado para a tela de login.

Se preferir abrir o frontend separadamente sem o backend, utilize a extensão Live Server no VS Code e inicie pelo arquivo `src/pages/login.html`.

## Scripts disponíveis (backend)

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor com nodemon (hot-reload) |
| `npm start` | Inicia o servidor em modo produção |
| `npm stop` | Encerra o processo na porta 3000 |
| `npm run status` | Verifica se o servidor está respondendo |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Executa as migrations no banco |

## Status do projeto

O backend está implementado e integrado aos fluxos de autenticação, configurações e perfil de usuário. As páginas de dispositivos e logs ainda operam com dados simulados no frontend, aguardando a implementação das rotas correspondentes na API.

Próximos passos:

- Integrar a página de dispositivos com a API real
- Implementar os endpoints de logs com filtros
- Conectar o dashboard aos dados de `traffic_samples`
- Implementar a verificação de 2FA

## Objetivo acadêmico

Este trabalho foi criado para aplicar conceitos de:

- desenvolvimento de interfaces web
- organização de fluxos de navegação
- experiência do usuário em sistemas administrativos
- visualização de dados e monitoramento operacional
- desenvolvimento de APIs REST com autenticação e persistência de dados

## Equipe

- Haniel Maia
- João Calheiros
- Kaua Heronides
- Jesse Alves
