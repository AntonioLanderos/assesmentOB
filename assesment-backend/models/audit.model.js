const db = require('../utils/database');

async function log(userId, action, refId = null) {
  await db.query(
    `INSERT INTO audit_log(user_id,action,ref_id) VALUES (?,?,?)`,
    [userId || null, action, refId]
  );
}

module.exports = { log };
