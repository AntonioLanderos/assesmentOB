const { assignByUserIds } = require('../models/doctorPatient.model');

async function postAssign(req, res, next) {
  try {
    const { doctorUserId, patientUserId } = req.body || {};
    if (!doctorUserId || !patientUserId) return res.status(400).json({ error: 'doctorUserId and patientUserId required' });
    await assignByUserIds(Number(doctorUserId), Number(patientUserId));
    res.json({ ok: true });
  } catch (e) {
    if (e.message === 'DOCTOR_NOT_FOUND' || e.message === 'PATIENT_NOT_FOUND')
      return res.status(404).json({ error: e.message });
    next(e);
  }
}

module.exports = { postAssign };
