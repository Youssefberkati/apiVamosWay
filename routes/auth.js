const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res
        .status(400)
        .json({ error: 'email, password et name sont requis' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email déjà utilisé' });

    const user = await User.create({ email, password, name });
    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email et mot de passe requis' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res
        .status(401)
        .json({ error: 'Identifiant et/ou mot de passe erroné' });

    const token = signToken(user._id);
    res.json({ token, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me  (requires token)
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
      return res.status(401).json({ error: 'Token manquant' });

    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ error: 'Utilisateur introuvable' });

    res.json({ user: user.toPublic() });
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// PATCH /api/users/profile  (requires token)
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      avatar_url,
      bio,
      home_city,
      visited_cities,
      nationality,
      travel_style,
      languages_spoken,
    } = req.body;
    const updates = {};
    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed)
        return res.status(400).json({ error: 'Le nom ne peut pas être vide' });
      updates.name = trimmed;
    }
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (bio !== undefined)
      updates.bio = bio ? String(bio).trim().slice(0, 300) : null;
    if (home_city !== undefined)
      updates.home_city = home_city ? String(home_city).trim() : null;
    if (visited_cities !== undefined && Array.isArray(visited_cities))
      updates.visited_cities = visited_cities;
    if (nationality !== undefined)
      updates.nationality = nationality ? String(nationality).trim() : null;
    if (travel_style !== undefined) updates.travel_style = travel_style || null;
    if (languages_spoken !== undefined && Array.isArray(languages_spoken))
      updates.languages_spoken = languages_spoken;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!user)
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json({ user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:userId  (profil public d'un utilisateur)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      '-password -email -role',
    );
    if (!user)
      return res.status(404).json({ error: 'Utilisateur introuvable' });

    const Itinerary = require('../models/Itinerary');
    const tripCount = await Itinerary.countDocuments({
      user_id: user._id,
      is_public: true,
    });

    res.json({
      id: user._id,
      name: user.name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      home_city: user.home_city,
      nationality: user.nationality,
      travel_style: user.travel_style,
      visited_cities: user.visited_cities,
      languages_spoken: user.languages_spoken,
      member_since: user.createdAt,
      trip_count: tripCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
