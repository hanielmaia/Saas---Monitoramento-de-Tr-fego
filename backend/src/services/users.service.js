const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

async function updateProfile(userId, { name, email, currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuário não encontrado.');

  // Validar senha atual se fornecida
  if (currentPassword) {
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new Error('Senha atual incorreta.');
  }

  const data = {};
  if (name) data.name = name;
  if (email && email !== user.email) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new Error('Este e-mail já está em uso.');
    data.email = email;
  }
  if (newPassword) {
    if (!currentPassword) throw new Error('Informe a senha atual para trocar a senha.');
    data.password = await bcrypt.hash(newPassword, 10);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, role: true },
  });

  return updated;
}

module.exports = { updateProfile };
