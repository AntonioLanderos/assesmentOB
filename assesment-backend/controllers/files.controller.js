const { presignPut, presignGet } = require('../services/s3.service');
const Files = require('../models/file.model');
const Access = require('../models/fileAccess.model');

async function listMine(req, res, next) {
  try {
    const files = await Files.listMine(Number(req.user.id));
    res.json({ files });
  } catch (e) { next(e); }
}

async function presignUpload(req, res, next) {
  try {
    const { filename, mime } = req.body || {};
    if (!filename) return res.status(400).json({ error: 'filename required' });

    const bucket = process.env.S3_BUCKET;
    if (!bucket) return res.status(500).json({ error: 'S3_BUCKET not configured' });

    const key = `u_${req.user.id}/${Date.now()}_${filename}`;
    const url = await presignPut({ bucket, key, contentType: mime || 'application/pdf' });

    const id = await Files.createMeta({
      ownerUserId: Number(req.user.id),
      bucket, objectKey: key, mime: mime || 'application/pdf'
    });

    res.json({ id, key, url });
  } catch (e) { next(e); }
}

async function presignDownload(req, res, next) {
  try {
    const id = Number(req.params.id);
    const f = await Files.getById(id);
    if (!f) return res.status(404).json({ error: 'NOT_FOUND' });

    const isOwner = f.owner_user_id === Number(req.user.id);
    const allowed = isOwner || await Access.hasAccess(id, Number(req.user.id));
    if (!allowed) return res.status(403).json({ error: 'FORBIDDEN' });

    const url = await presignGet({ bucket: f.bucket, key: f.object_key });
    res.json({ url });
  } catch (e) { next(e); }
}

async function grantAccess(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const f = await Files.getById(id);
    if (!f) return res.status(404).json({ error: 'NOT_FOUND' });

    // dueño o ADMIN
    const isOwner = f.owner_user_id === Number(req.user.id);
    const isAdmin = req.user.role === 'ADMIN';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'FORBIDDEN' });

    await Access.grant(id, Number(userId));
    res.json({ ok: true });
  } catch (e) { next(e); }
}

module.exports = { listMine, presignUpload, presignDownload, grantAccess };
