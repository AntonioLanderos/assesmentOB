const express = require('express');
const { postCheckout } = require('../controllers/billing.controller');
const { requireAuth } = require('../utils/middlewares/requireAuth');

const router = express.Router();

router.post('/checkout', requireAuth, postCheckout);

module.exports = router;
