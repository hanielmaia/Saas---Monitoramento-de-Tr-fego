const authService = require('../services/auth.service');

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const user = await authService.register({ name, email, password });
    return res.status(201).json({ message: 'Usuário criado com sucesso.', user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const result = await authService.login({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

async function me(req, res) {
  try {
    const user = await authService.me(req.userId);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function logout(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await authService.logout(token);
    }
    return res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao fazer logout.' });
  }
}

module.exports = { register, login, me, logout };
