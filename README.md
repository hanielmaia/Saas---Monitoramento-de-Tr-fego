# N Eyes

Plataforma web de monitoramento de tráfego de rede com foco em visualização operacional, acompanhamento de dispositivos conectados e organização de eventos da infraestrutura.

O projeto foi desenvolvido como trabalho acadêmico para a disciplina de Desenvolvimento Web e apresenta uma interface SaaS voltada para cenários de observabilidade de rede, com navegação entre dashboard, dispositivos, logs, configurações e perfil do usuário.


## Visão geral

O N Eyes foi pensado para centralizar, em uma única interface, informações importantes sobre o comportamento da rede. A proposta da aplicação é permitir que o usuário acompanhe indicadores de tráfego, visualize dispositivos ativos, consulte registros de eventos e ajuste políticas operacionais em um painel com linguagem visual consistente.

Atualmente, este repositório representa o front-end estático da solução, com interações locais em JavaScript e dados simulados para demonstrar a experiência do produto.

## O que a aplicação entrega hoje

- 📊 Dashboard com métricas de download, upload e dispositivos conectados
- 📈 Gráfico de tráfego com visualização operacional da rede
- ➡️ Menu lateral para navegação entre os módulos principais
- 🔔 Central de notificações e menu de perfil no topo da interface
- 🖥️ Página de dispositivos com tabela detalhada e ações de bloqueio/desbloqueio e renomeação
- 📜 Página de logs com filtros visuais, paginação e organização dos registros
- ⚙️ Painel administrativo com parâmetros de monitoramento, retenção e políticas de segurança
- 📝 Tela de edição de perfil do usuário
- 📁 Fluxos de login, cadastro e confirmação de logout

## Estrutura das telas

### 1. Autenticação

- `login.html`: acesso ao sistema
- `register.html`: criação de conta
- `logout-confirm.html`: confirmação de encerramento de sessão

### 2. Operação e monitoramento

- `home.html`: dashboard principal com indicadores e visão geral da rede
- `devices.html`: gestão dos dispositivos conectados
- `logs.html`: consulta de eventos e registros operacionais
- `config.html`: configurações administrativas da plataforma
- `edit-profile.html`: atualização de dados do usuário

## Principais recursos por módulo

### Dashboard

- Exibe status geral da rede
- Apresenta métricas principais de tráfego
- Mostra gráfico com comportamento de uso
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

- Centraliza parâmetros de monitoramento de rede
- Define regras de retenção de logs
- Reúne políticas de segurança e sessão
- Utiliza modais personalizados para feedback de ações

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.2
- Chart.js
- Lucide Icons

## Como executar

Como o projeto é estático, não há etapa obrigatória de build.

1. Clone ou baixe este repositório.
2. Abra a pasta do projeto no VS Code.
3. Inicie pela página `login.html` em um navegador.

Se preferir uma navegação local mais prática, utilize a extensão Live Server no VS Code para abrir o projeto com recarregamento automático.

## Status do projeto

O projeto está em fase de desenvolvimento do front-end. A interface já demonstra os principais fluxos do produto, mas ainda depende de integração com backend para funcionalidades como autenticação real, persistência de dados, atualização em tempo real e gerenciamento completo de usuários.

## Objetivo acadêmico

Este trabalho foi criado para aplicar conceitos de:

- desenvolvimento de interfaces web
- organização de fluxos de navegação
- experiência do usuário em sistemas administrativos
- visualização de dados e monitoramento operacional

## Equipe

- Haniel Maia
- João Calheiros
- Kaua Heronides
- Jesse Alves
