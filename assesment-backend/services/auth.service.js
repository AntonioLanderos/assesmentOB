const bcrypt = require('bcrypt');
const Users = require('../models/user.model');
const { sign } = require('../utils/jwt');

async function register({ email, password, role }) {
  const exists = await Users.findByEmail(email);
  if (exists) return { error: 'EMAIL_TAKEN' };

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await Users.createUser({ email, passwordHash, role });
  const basic = await Users.findById(userId);
  const token = sign({ id: basic.id, email: basic.email, role: basic.role });
  return { token };
}

async function login({ email, password }) {
  const user = await Users.findByEmail(email);
  if (!user) return { error: 'INVALID_CREDENTIALS' };

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return { error: 'INVALID_CREDENTIALS' };

  const token = sign({ id: Number(user.id), email: user.email, role: user.role });
  return { token };
}

async function me(userId) {
  return Users.findWithSubscription(userId);
}

module.exports = { register, login, me };
