const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter mínimo 2 caracteres',
    'string.max': 'Nome não pode ter mais de 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email é obrigatório',
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter mínimo 6 caracteres',
    'any.required': 'Senha é obrigatória'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email é obrigatório',
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Senha é obrigatória',
    'any.required': 'Senha é obrigatória'
  })
});

const deviceStatusSchema = Joi.string().valid('ONLINE', 'OFFLINE', 'MAINTENANCE').messages({
  'any.only': 'Status deve ser ONLINE, OFFLINE ou MAINTENANCE'
});

const deviceCreateSchema = Joi.object({
  ip: Joi.string().ip({ version: ['ipv4'] }).required().messages({
    'string.empty': 'IP é obrigatório',
    'string.ip': 'IP inválido',
    'any.required': 'IP é obrigatório'
  }),
  hostname: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Hostname é obrigatório',
    'any.required': 'Hostname é obrigatório'
  }),
  status: deviceStatusSchema.default('OFFLINE'),
  bandwidth: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Bandwidth deve ser um número',
    'number.min': 'Bandwidth deve ser maior ou igual a 0'
  }),
  blocked: Joi.boolean().default(false)
});

const deviceUpdateSchema = Joi.object({
  ip: Joi.string().ip({ version: ['ipv4'] }).messages({
    'string.ip': 'IP inválido'
  }),
  hostname: Joi.string().trim().min(1).messages({
    'string.empty': 'Hostname não pode ser vazio'
  }),
  status: deviceStatusSchema,
  bandwidth: Joi.number().integer().min(0).messages({
    'number.base': 'Bandwidth deve ser um número',
    'number.min': 'Bandwidth deve ser maior ou igual a 0'
  }),
  blocked: Joi.boolean()
}).or('ip', 'hostname', 'status', 'bandwidth', 'blocked').messages({
  'object.missing': 'Pelo menos um campo deve ser informado para atualização'
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Nome deve ter mínimo 2 caracteres',
    'string.max': 'Nome não pode ter mais de 100 caracteres'
  }),
  email: Joi.string().trim().email().messages({
    'string.email': 'Email inválido'
  }),
  currentPassword: Joi.string().min(6).messages({
    'string.min': 'Senha atual deve ter mínimo 6 caracteres'
  }),
  newPassword: Joi.string().min(6).messages({
    'string.min': 'Nova senha deve ter mínimo 6 caracteres'
  })
}).with('newPassword', 'currentPassword').or('name', 'email', 'currentPassword', 'newPassword').messages({
  'object.missing': 'Pelo menos um campo deve ser informado para atualização'
});

const settingsUpdateSchema = Joi.object({
  alertThreshold: Joi.number().integer().min(0).max(100).messages({
    'number.base': 'alertThreshold deve ser um número',
    'number.min': 'alertThreshold deve ser maior ou igual a 0',
    'number.max': 'alertThreshold deve ser menor ou igual a 100'
  }),
  scanFrequency: Joi.number().integer().min(1).max(3600).messages({
    'number.base': 'scanFrequency deve ser um número',
    'number.min': 'scanFrequency deve ser maior ou igual a 1',
    'number.max': 'scanFrequency deve ser menor ou igual a 3600'
  }),
  retentionDays: Joi.number().integer().min(1).max(365).messages({
    'number.base': 'retentionDays deve ser um número',
    'number.min': 'retentionDays deve ser maior ou igual a 1',
    'number.max': 'retentionDays deve ser menor ou igual a 365'
  }),
  minPasswordLength: Joi.number().integer().min(6).max(128).messages({
    'number.base': 'minPasswordLength deve ser um número',
    'number.min': 'minPasswordLength deve ser maior ou igual a 6',
    'number.max': 'minPasswordLength deve ser menor ou igual a 128'
  })
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser informado para atualização'
});

const logCreateSchema = Joi.object({
  deviceId: Joi.alternatives().try(Joi.string().trim().min(1), Joi.number()).required().messages({
    'any.required': 'deviceId é obrigatório',
    'string.empty': 'deviceId não pode ser vazio'
  }),
  deviceName: Joi.string().trim().min(1).required().messages({
    'string.empty': 'deviceName é obrigatório',
    'any.required': 'deviceName é obrigatório'
  }),
  message: Joi.string().trim().min(1).required().messages({
    'string.empty': 'message é obrigatório',
    'any.required': 'message é obrigatório'
  }),
  severity: Joi.string().valid('info', 'warning', 'critical').messages({
    'any.only': 'Severity deve ser: info, warning ou critical'
  }),
  type: Joi.string().trim().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  deviceCreateSchema,
  deviceUpdateSchema,
  updateUserSchema,
  settingsUpdateSchema,
  logCreateSchema
};
