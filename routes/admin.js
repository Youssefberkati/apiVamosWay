const express = require('express');
const { Hotel, Restaurant, Activity } = require('../models/Content');
const Review = require('../models/Review');
const adminAuth = require('../middleware/adminMiddleware');

const router = express.Router();
// Toutes les routes de ce fichier nécessitent le rôle admin
router.use(adminAuth);

// ─────────────────────────────────────────
// HÔTELS
// ─────────────────────────────────────────

// GET /api/admin/hotels?city_id=marrakech
router.get('/hotels', async (req, res) => {
  try {
    const { city_id } = req.query;
    const filter = city_id ? { city_id } : {};
    const hotels = await Hotel.find(filter).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/hotels
router.post('/hotels', async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/admin/hotels/:id
router.patch('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) return res.status(404).json({ error: 'Hôtel introuvable.' });
    res.json(hotel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/hotels/:id
router.delete('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hôtel introuvable.' });
    res.json({ message: 'Hôtel supprimé.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/hotels/:id/sponsor  – activer/désactiver le sponsoring
router.patch('/hotels/:id/sponsor', async (req, res) => {
  try {
    const { is_sponsored, sponsor_until } = req.body;
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { is_sponsored: !!is_sponsored, sponsor_until: sponsor_until || null },
      { new: true },
    );
    if (!hotel) return res.status(404).json({ error: 'Hôtel introuvable.' });
    res.json(hotel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// RESTAURANTS
// ─────────────────────────────────────────

router.get('/restaurants', async (req, res) => {
  try {
    const { city_id } = req.query;
    const filter = city_id ? { city_id } : {};
    const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/restaurants', async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!restaurant)
      return res.status(404).json({ error: 'Restaurant introuvable.' });
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant)
      return res.status(404).json({ error: 'Restaurant introuvable.' });
    res.json({ message: 'Restaurant supprimé.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// ACTIVITÉS
// ─────────────────────────────────────────

router.get('/activities', async (req, res) => {
  try {
    const { city_id, category } = req.query;
    const filter = {};
    if (city_id) filter.city_id = city_id;
    if (category) filter.category = new RegExp(category, 'i');
    const activities = await Activity.find(filter).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/activities', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/activities/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!activity)
      return res.status(404).json({ error: 'Activité introuvable.' });
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/activities/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity)
      return res.status(404).json({ error: 'Activité introuvable.' });
    res.json({ message: 'Activité supprimée.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/activities/:id/sponsor', async (req, res) => {
  try {
    const { is_sponsored, sponsor_until } = req.body;
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { is_sponsored: !!is_sponsored, sponsor_until: sponsor_until || null },
      { new: true },
    );
    if (!activity)
      return res.status(404).json({ error: 'Activité introuvable.' });
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// MODÉRATION DES AVIS
// ─────────────────────────────────────────

// GET /api/admin/reviews/pending
router.get('/reviews/pending', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('user_id', 'name email avatar_url')
      .sort({ createdAt: 1 }); // Les plus anciens en premier
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/reviews/:id/approve
router.patch('/reviews/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', admin_notes: null },
      { new: true },
    ).populate('user_id', 'name avatar_url');
    if (!review) return res.status(404).json({ error: 'Avis introuvable.' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/reviews/:id/reject
router.patch('/reviews/:id/reject', async (req, res) => {
  try {
    const { admin_notes } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', admin_notes: admin_notes || 'Non conforme.' },
      { new: true },
    ).populate('user_id', 'name avatar_url');
    if (!review) return res.status(404).json({ error: 'Avis introuvable.' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
