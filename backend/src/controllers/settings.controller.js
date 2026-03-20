const { getSettings, saveSettings } = require('../services/settings.service');

async function index(req, res) {
  try {
    res.json(await getSettings());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function save(req, res) {
  try {
    res.json({ message: 'Configurações salvas.', settings: await saveSettings(req.body) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { index, save };
