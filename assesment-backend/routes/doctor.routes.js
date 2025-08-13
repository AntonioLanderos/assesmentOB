const express = require('express');
const router = express.Router();
const { getMyPatients, getPatientFiles } = require('../controllers/doctor.controller');
const { requireAuth } = require('../utils/middlewares/requireAuth');

router.get('/patients', requireAuth, getMyPatients);
router.get('/patients/:patientUserId/files', requireAuth, getPatientFiles);

module.exports = router;
