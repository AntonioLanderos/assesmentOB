const { stripe } = require('../services/stripe.service');
const Events = require('../models/webhookEvent.model');
const Subs = require('../models/subscription.model');
const Audit = require('../models/audit.model');

async function handleStripe(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (await Events.exists(event.id)) {
    await Events.save({ id: event.id, type: event.type, payload: { duplicate: true }, status: 'processed' });
    return res.status(200).send('OK (duplicate)');
  }

  let status = 'processed', error = null;
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object;
        const userId = Number(s.client_reference_id);
        await Subs.activate(userId, s.customer?.toString() || null, s.subscription?.toString() || null);
        await Audit.log(userId, 'SUB_CREATE');
        break;
      }
      case 'invoice.payment_succeeded': {
        const inv = event.data.object;
        const subId = typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id;
        if (subId) {
          const end = inv.lines?.data?.[0]?.period?.end || null;
          await Subs.setActiveByStripeSub(subId, end);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const inv = event.data.object;
        const subId = typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id;
        if (subId) await Subs.setPastDueByStripeSub(subId);
        break;
      }
      case 'customer.subscription.deleted': {
        const s = event.data.object;
        await Subs.cancelByStripeSub(s.id);
        break;
      }
      default: break;
    }
  } catch (e) { status = 'failed'; error = e.message; }
  finally {
    await Events.save({ id: event.id, type: event.type, payload: event, status, error });
  }
  res.json({ received: true });
}

module.exports = { handleStripe };
