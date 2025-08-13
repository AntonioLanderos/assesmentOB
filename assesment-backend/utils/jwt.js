const jwt = require('jsonwebtoken');

function sanitizeBigInt(obj) {
  return JSON.parse(JSON.stringify(obj, (k, v) => (typeof v === 'bigint' ? Number(v) : v)));
}

function sign(payload, expiresIn = process.env.JWT_EXPIRES_IN) {
    const safe = sanitizeBigInt(payload);
  return jwt.sign(safe, process.env.JWT_SECRET, { expiresIn });
}

function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { sign, verify };