const bcrypt = require('bcrypt');

async function generatePasswords() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
}

generatePasswords();
