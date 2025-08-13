const express = require('express');
const router = express.Router();
const { postAssign } = require('../controllers/admin.controller');
const { requireAuth } = require('../utils/middlewares/requireAuth');
const requireRole = require('../utils/middlewares/requireRole');

router.post('/assign', requireAuth, requireRole('ADMIN'), postAssign);

module.exports = router;
