const Subs = require('../models/subscription.model');
const { stripe } = require('../services/stripe.service');

function ensureAbsolute(url) {
  if (!url) throw new Error('FRONTEND_ORIGIN no está definido');
  return /^https?:\/\//i.test(url) ? url : `http://${url}`;
}

async function postCheckout(req, res, next) {
  try {
    const origin = ensureAbsolute(process.env.FRONTEND_ORIGIN);
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId || !priceId.startsWith('price_')) {
      throw new Error('Config: STRIPE_PRICE_ID ausente o inválido (debe empezar con "price_")');
    }

    await Subs.ensureRow(Number(req.user.id));

    console.log('[billing] priceId=', process.env.STRIPE_PRICE_ID, 'origin=', process.env.FRONTEND_ORIGIN);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/cancel`,
      client_reference_id: String(req.user.id),
    });

    res.json({ url: session.url });
  } catch (e) { next(e); }
}

module.exports = { postCheckout };
