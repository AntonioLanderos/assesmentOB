const db = require('../utils/database');

function mapFile(r) {
  return {
    id: Number(r.id),
    objectKey: r.object_key,
    mime: r.mime,
    sizeBytes: r.size_bytes == null ? null : Number(r.size_bytes),
    createdAt: r.created_at,
  };
}

async function listByOwnerUserId(ownerUserId) {
  const rows = await db.query(
    'SELECT id, object_key, mime, size_bytes, created_at FROM files WHERE owner_user_id=? ORDER BY created_at DESC',
    [ownerUserId]
  );
  return rows.map(mapFile);
}

async function createMeta({ ownerUserId, bucket, objectKey, mime, sizeBytes = null }) {
  const r = await db.query(
    `INSERT INTO files(owner_user_id,bucket,object_key,mime,size_bytes)
     VALUES (?,?,?,?,?)`,
    [ownerUserId, bucket, objectKey, mime || null, sizeBytes]
  );
  return Number(r.insertId);
}

async function getById(id) {
  const rows = await db.query(`SELECT * FROM files WHERE id=?`, [id]);
  const f = rows[0];
  if (!f) return null;
  f.id = Number(f.id);
  f.owner_user_id = Number(f.owner_user_id);
  return f;
}

async function listMine(ownerUserId) {
  const rows = await db.query(
    `SELECT id, object_key AS objectKey, mime, size_bytes AS sizeBytes, created_at AS createdAt
     FROM files WHERE owner_user_id=? ORDER BY created_at DESC`,
    [ownerUserId]
  );
  return rows.map(r => ({ ...r, id: Number(r.id) }));
}

module.exports = { createMeta, getById, listMine, listByOwnerUserId };
