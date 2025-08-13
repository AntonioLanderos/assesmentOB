const Auth = require('../services/auth.service');

async function postRegister(req, res, next) {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'EMAIL_PASSWORD_REQUIRED' });

    const result = await Auth.register({ email, password, role });
    if (result.error === 'EMAIL_TAKEN') return res.status(409).json({ error: 'EMAIL_TAKEN' });

    res.status(201).json({ token: result.token });
  } catch (e) { next(e); }
}

async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'EMAIL_PASSWORD_REQUIRED' });

    const result = await Auth.login({ email, password });
    if (result.error === 'INVALID_CREDENTIALS') return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

    res.json({ token: result.token });
  } catch (e) { next(e); }
}

async function getMe(req, res, next) {
  try {
    const data = await Auth.me(req.user.id);
    if (!data) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json({ user: data });
  } catch (e) { next(e); }
}

module.exports = { postRegister, postLogin, getMe };
