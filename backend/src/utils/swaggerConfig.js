const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'N Eyes API',
    version: '1.0.0',
    description: 'Documentação da API do projeto N Eyes',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registra um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 }
                },
                required: ['name', 'email', 'password']
              }
            }
          }
        },
        responses: {
          201: { description: 'Usuário criado com sucesso' },
          400: { description: 'Erro de validação' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Faz login e retorna token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Login realizado com sucesso' },
          400: { description: 'Erro de validação' },
          401: { description: 'Credenciais inválidas' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obtém dados do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Usuário autenticado retornado' },
          401: { description: 'Token inválido ou não fornecido' }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Faz logout do usuário',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Logout realizado com sucesso' },
          401: { description: 'Token inválido ou não fornecido' }
        }
      }
    },
    '/api/devices': {
      get: {
        tags: ['Devices'],
        summary: 'Lista todos os dispositivos',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de dispositivos retornada' }
        }
      },
      post: {
        tags: ['Devices'],
        summary: 'Cria um novo dispositivo',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ip: { type: 'string' },
                  hostname: { type: 'string' },
                  status: { type: 'string', enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE'] },
                  bandwidth: { type: 'integer' },
                  blocked: { type: 'boolean' }
                },
                required: ['ip', 'hostname']
              }
            }
          }
        },
        responses: {
          201: { description: 'Dispositivo criado com sucesso' },
          400: { description: 'Erro de validação' }
        }
      }
    },
    '/api/devices/{id}': {
      patch: {
        tags: ['Devices'],
        summary: 'Atualiza um dispositivo existente',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ip: { type: 'string' },
                  hostname: { type: 'string' },
                  status: { type: 'string', enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE'] },
                  bandwidth: { type: 'integer' },
                  blocked: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Dispositivo atualizado com sucesso' },
          400: { description: 'Erro de validação' },
          404: { description: 'Dispositivo não encontrado' }
        }
      }
    },
    '/api/logs': {
      get: {
        tags: ['Logs'],
        summary: 'Lista todos os logs',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de logs retornada' }
        }
      },
      post: {
        tags: ['Logs'],
        summary: 'Cria um log',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  deviceId: { type: 'string' },
                  deviceName: { type: 'string' },
                  message: { type: 'string' },
                  severity: { type: 'string', enum: ['info', 'warning', 'critical'] },
                  type: { type: 'string' }
                },
                required: ['deviceId', 'deviceName', 'message']
              }
            }
          }
        },
        responses: {
          201: { description: 'Log criado com sucesso' },
          400: { description: 'Erro de validação' }
        }
      }
    },
    '/api/settings': {
      patch: {
        tags: ['Settings'],
        summary: 'Atualiza configurações do sistema',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  alertThreshold: { type: 'integer' },
                  scanFrequency: { type: 'integer' },
                  retentionDays: { type: 'integer' },
                  minPasswordLength: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Configurações atualizadas com sucesso' },
          400: { description: 'Erro de validação' }
        }
      }
    },
    '/api/users/me': {
      patch: {
        tags: ['Users'],
        summary: 'Atualiza perfil do usuário logado',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  currentPassword: { type: 'string' },
                  newPassword: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Perfil atualizado com sucesso' },
          400: { description: 'Erro de validação ou dados inválidos' }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
