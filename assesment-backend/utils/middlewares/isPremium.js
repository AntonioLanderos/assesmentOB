const db = require('../../utils/database');

module.exports = async function isPremium(req, res, next) {
  try {
    const rows = await db.query('SELECT status FROM subscriptions WHERE user_id=?', [req.user.id]);
    const status = rows[0]?.status || 'free';
    if (status !== 'active') return res.status(402).json({ error: 'PAYMENT_REQUIRED' });
    next();
  } catch (e) { next(e); }
};
