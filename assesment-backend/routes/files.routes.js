const express = require('express');
const router = express.Router();
const { listMine, presignUpload, presignDownload, grantAccess } = require('../controllers/files.controller');
const { requireAuth } = require('../utils/middlewares/requireAuth');

router.get('/mine', requireAuth, listMine);
router.post('/presign-upload', requireAuth, presignUpload);
router.post('/:id/presign-download', requireAuth, presignDownload);
router.post('/:id/grant', requireAuth, grantAccess);

module.exports = router;
