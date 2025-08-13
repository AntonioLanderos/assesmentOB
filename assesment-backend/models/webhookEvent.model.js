const db = require('../utils/database');

async function exists(eventId) {
  const rows = await db.query(`SELECT id FROM webhook_events WHERE stripe_event_id=?`, [eventId]);
  return !!rows[0];
}

async function save({ id, type, payload, status, error }) {
  await db.query(
    `INSERT INTO webhook_events(stripe_event_id,type,payload_json,processed_at,status,error)
     VALUES (?,?,?,?,?,?)`,
    [id, type, JSON.stringify(payload), new Date(), status || 'processed', error || null]
  );
}

module.exports = { exists, save };
