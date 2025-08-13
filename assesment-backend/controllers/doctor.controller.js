const { listPatientsForDoctor, isAssigned } = require('../models/doctorPatient.model');
const { listByOwnerUserId } = require('../models/file.model');
const Doctor = require('../models/doctor.model');

async function getMyPatients(req, res, next) {
  try {
    const list = await listPatientsForDoctor(Number(req.user.id));
    res.json({ patients: list });
  } catch (e) { next(e); }
}

async function getPatientFiles(req, res, next) {
  try {
    const patientUserId = Number(req.params.patientUserId);
    const assigned = await isAssigned(Number(req.user.id), patientUserId);
    if (!assigned) return res.status(403).json({ error: 'FORBIDDEN' });

    const files = await listByOwnerUserId(patientUserId);
    res.json({ files });
  } catch (e) { next(e); }
}

async function getPatientFiles(req, res, next) {
  try {
    const doctorUserId  = Number(req.user.id);
    const patientUserId = Number(req.params.patientUserId);

    if (req.user.role === 'ADMIN') {
      const files = await Files.listByOwnerUserId(patientUserId);
      return res.json({ files });
    }

    const files = await Doctor.listFilesForAssignedPair(doctorUserId, patientUserId);
    return res.json({ files });
  } catch (e) { next(e); }
}


module.exports = { getMyPatients, getPatientFiles };
