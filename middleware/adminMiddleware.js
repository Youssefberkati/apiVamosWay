const auth = require('./authMiddleware');

// Middleware admin : vérifie le JWT + le role admin
module.exports = async (req, res, next) => {
  await auth(req, res, async () => {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs.' });
    }
    next();
  });
};
