const db = require('../utils/database');

async function findByEmail(email) {
  const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findWithSubscription(id) {
  const rows = await db.query(
    `SELECT u.id,u.email,u.role, COALESCE(s.status,'free') AS status, s.current_period_end
     FROM users u LEFT JOIN subscriptions s ON s.user_id=u.id
     WHERE u.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findById(id) {
  const rows = await db.query('SELECT id,email,role FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

async function createUser({ email, passwordHash, role = 'PATIENT' }) {
  let conn;
  const pool = db.pool;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const r = await conn.query(
      'INSERT INTO users(email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, role]
    );

    await conn.query(
      `INSERT INTO subscriptions(user_id, status)
       VALUES (?, 'free')
       ON DUPLICATE KEY UPDATE user_id = user_id`,
      [r.insertId]
    );

    if (role === 'PATIENT') await conn.query('INSERT INTO patients(user_id) VALUES (?)', [r.insertId]);
    if (role === 'DOCTOR')  await conn.query('INSERT INTO doctors(user_id) VALUES (?)',  [r.insertId]);

    await conn.commit();
    return r.insertId;
  } catch (e) {
    if (conn) await conn.rollback();
    throw e;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { findByEmail, findWithSubscription, findById, createUser };
