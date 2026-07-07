const Joi = require('joi');

function formatJoiErrors(error) {
  const errors = {};

  if (!error || !error.details) {
    return errors;
  }

  error.details.forEach((detail) => {
    const key = detail.path.join('.') || detail.context?.key || 'value';
    errors[key] = detail.message.replace(/"/g, '');
  });

  return errors;
}

function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Erro de validação',
        errors: formatJoiErrors(error)
      });
    }

    req.body = value;
    next();
  };
}

module.exports = {
  validateRequest
};
