const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'N Eyes API',
    version: '1.0.0',
    description: 'Documentação da API do projeto N Eyes para monitoramento de tráfego.'
  },
  servers: [
    {
      url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
      description: 'Servidor local'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'Endpoints de saúde e status do sistema'
    },
    {
      name: 'Auth',
      description: 'Autenticação e gerenciamento de sessão'
    },
    {
      name: 'Devices',
      description: 'Gerenciamento de dispositivos monitorados'
    },
    {
      name: 'Users',
      description: 'Operações com usuários e perfil'
    }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API está online',
        responses: {
          200: {
            description: 'API disponível',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    message: { type: 'string', example: 'Servidor está rodando!' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autentica um usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login realizado com sucesso' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Credenciais inválidas' }
        }
      }
    },
    '/api/devices': {
      get: {
        tags: ['Devices'],
        summary: 'Lista os dispositivos cadastrados',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista retornada com sucesso' },
          401: { description: 'Token inválido ou ausente' }
        }
      }
    },
    '/api/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Retorna os dados do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Usuário retornado com sucesso' },
          401: { description: 'Token inválido ou ausente' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

export const swaggerSpec = swaggerDefinition;
