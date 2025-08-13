const db = require('../utils/database');

async function assignByUserIds(doctorUserId, patientUserId) {
  // obtiene ids de tablas doctors/patients
  const [d] = await db.query('SELECT id FROM doctors WHERE user_id=?', [doctorUserId]);
  const [p] = await db.query('SELECT id FROM patients WHERE user_id=?', [patientUserId]);
  if (!d) throw new Error('DOCTOR_NOT_FOUND');
  if (!p) throw new Error('PATIENT_NOT_FOUND');

  await db.query(
    `INSERT INTO doctor_patient (doctor_id, patient_id)
     VALUES (?, ?) ON DUPLICATE KEY UPDATE doctor_id=doctor_id`,
    [Number(d.id), Number(p.id)]
  );
  return true;
}

async function listPatientsForDoctor(doctorUserId) {
  const rows = await db.query(
    `SELECT p.user_id AS patientUserId, u.email
       FROM doctor_patient dp
       JOIN doctors d  ON d.id=dp.doctor_id
       JOIN patients p ON p.id=dp.patient_id
       JOIN users u    ON u.id=p.user_id
      WHERE d.user_id=?`,
    [doctorUserId]
  );
  return rows.map(r => ({ patientUserId: Number(r.patientUserId), email: r.email }));
}

async function isAssigned(doctorUserId, patientUserId) {
  const rows = await db.query(
    `SELECT 1
       FROM doctor_patient dp
       JOIN doctors d  ON d.id=dp.doctor_id
       JOIN patients p ON p.id=dp.patient_id
      WHERE d.user_id=? AND p.user_id=? LIMIT 1`,
    [doctorUserId, patientUserId]
  );
  return !!rows[0];
}

module.exports = { assignByUserIds, listPatientsForDoctor, isAssigned };
