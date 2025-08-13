const db = require('../utils/database');

async function grant(fileId, granteeUserId) {
  await db.query(
    `INSERT INTO file_access(file_id,grantee_user_id)
     VALUES(?,?) ON DUPLICATE KEY UPDATE file_id=file_id`,
    [fileId, granteeUserId]
  );
  return true;
}

async function hasAccess(fileId, userId) {
  const rows = await db.query(
    `SELECT 1 FROM file_access WHERE file_id=? AND grantee_user_id=? LIMIT 1`,
    [fileId, userId]
  );
  return !!rows[0];
}

module.exports = { grant, hasAccess };
