const { updateProfile } = require('../services/users.service');

async function putMe(req, res) {
  try {
    const user = await updateProfile(req.userId, req.body);
    res.json({ message: 'Perfil atualizado com sucesso.', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { putMe };
