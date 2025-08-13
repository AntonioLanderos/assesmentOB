const db = require('../utils/database');

async function getDoctorIdByUserId(doctorUserId) {
  const rows = await db.query('SELECT id FROM doctors WHERE user_id=?', [doctorUserId]);
  return rows[0]?.id ? Number(rows[0].id) : null;
}

function mapFile(r) {
  return {
    id: Number(r.id),
    objectKey: r.object_key,
    mime: r.mime,
    sizeBytes: r.size_bytes == null ? null : Number(r.size_bytes),
    createdAt: r.created_at,
  };
}

async function listFilesForAssignedPair(doctorUserId, patientUserId) {
  const rows = await db.query(
    `SELECT f.id, f.object_key, f.mime, f.size_bytes, f.created_at
       FROM files f
       JOIN patients p        ON p.user_id = f.owner_user_id
       JOIN doctor_patient dp ON dp.patient_id = p.id
       JOIN doctors d         ON d.id = dp.doctor_id
      WHERE d.user_id = ? AND p.user_id = ?
      ORDER BY f.created_at DESC`,
    [doctorUserId, patientUserId]
  );
  return rows.map(mapFile);
}

async function doctorCanSeeFile(doctorUserId, fileId) {
  const rows = await db.query(
    `SELECT 1
       FROM files f
       JOIN patients p        ON p.user_id = f.owner_user_id
       JOIN doctor_patient dp ON dp.patient_id = p.id
       JOIN doctors d         ON d.id = dp.doctor_id
      WHERE d.user_id = ? AND f.id = ?
      LIMIT 1`,
    [doctorUserId, fileId]
  );
  return !!rows[0];
}

module.exports = { getDoctorIdByUserId, listFilesForAssignedPair, doctorCanSeeFile };
