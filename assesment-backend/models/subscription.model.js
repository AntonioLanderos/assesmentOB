const db = require('../utils/database');

async function ensureRow(userId) {
  await db.query(
    `INSERT INTO subscriptions(user_id, status)
     VALUES (?, 'free')
     ON DUPLICATE KEY UPDATE user_id = user_id`,
    [userId]
  );
}

async function activate(userId, stripeCustomerId, stripeSubId) {
  await db.query(
    `UPDATE subscriptions
       SET status='active',
           stripe_customer_id=?,
           stripe_sub_id=?,
           updated_at=NOW()
     WHERE user_id=?`,
    [stripeCustomerId || null, stripeSubId || null, userId]
  );
}

async function setActiveByStripeSub(stripeSubId, currentPeriodEndTs) {
  const date = currentPeriodEndTs ? new Date(currentPeriodEndTs * 1000) : null;
  await db.query(
    `UPDATE subscriptions
        SET status='active',
            current_period_end=?,
            updated_at=NOW()
      WHERE stripe_sub_id=?`,
    [date, stripeSubId]
  );
}

async function setPastDueByStripeSub(stripeSubId) {
  await db.query(
    `UPDATE subscriptions SET status='past_due', updated_at=NOW() WHERE stripe_sub_id=?`,
    [stripeSubId]
  );
}

async function cancelByStripeSub(stripeSubId) {
  await db.query(
    `UPDATE subscriptions SET status='canceled', updated_at=NOW() WHERE stripe_sub_id=?`,
    [stripeSubId]
  );
}

module.exports = {
  ensureRow,
  activate,
  setActiveByStripeSub,
  setPastDueByStripeSub,
  cancelByStripeSub,
};
