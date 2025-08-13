const express = require('express');
const { postRegister, postLogin, getMe } = require('../controllers/auth.controller');
const { requireAuth } = require('../utils/middlewares/requireAuth');

const router = express.Router();

router.post('/register', postRegister); 
router.post('/login', postLogin);
router.get('/me', requireAuth, getMe);

module.exports = router;
