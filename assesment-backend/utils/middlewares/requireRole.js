function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'NO_TOKEN' });
    if (req.user.role !== role) return res.status(403).json({ error: 'FORBIDDEN' });
    next();
  };
}

module.exports = requireRole;
