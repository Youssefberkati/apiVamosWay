const express = require('express');
const { Hotel, Restaurant, Activity } = require('../models/Content');
const Review = require('../models/Review');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/content/hotels?city_id=1&budget_min=0&budget_max=100&limit=10
//   &amenities=wifi,pool        → hôtels ayant TOUS ces équipements
//   &cancellation=free          → politique d'annulation
//   &bed_type=double            → type de lit
//   &bed_count=2                → nombre de lits minimum
//   &stars_min=3                → étoiles minimum
// Tri : sponsorisés (actifs) en tête, puis par star_rating desc, puis avg_rating desc
router.get('/hotels', async (req, res) => {
  try {
    const {
      city_id,
      budget_min,
      budget_max,
      amenities,
      cancellation,
      bed_type,
      bed_count,
      stars_min,
      limit = 10,
    } = req.query;
    const match = {};
    if (city_id) match.city_id = city_id;
    if (budget_min || budget_max) {
      match.price_usd = {};
      if (budget_min) match.price_usd.$gte = Number(budget_min);
      if (budget_max) match.price_usd.$lte = Number(budget_max);
    }
    // Filtres avancés
    if (amenities) {
      const amenityList = amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);
      if (amenityList.length > 0) match.amenities = { $all: amenityList };
    }
    if (cancellation) match.cancellation_policy = cancellation;
    if (bed_type) match.bed_type = bed_type;
    if (bed_count) match.bed_count = { $gte: Number(bed_count) };
    if (stars_min) match.star_rating = { $gte: Number(stars_min) };
    const now = new Date();
    const hotels = await Hotel.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'reviews',
          let: { itemId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$element_type', 'hotel'] },
                    { $eq: ['$element_id', '$$itemId'] },
                    { $eq: ['$status', 'approved'] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                avg: { $avg: '$rating' },
                count: { $sum: 1 },
              },
            },
          ],
          as: 'reviewStats',
        },
      },
      {
        $addFields: {
          average_rating: {
            $ifNull: [{ $arrayElemAt: ['$reviewStats.avg', 0] }, null],
          },
          review_count: {
            $ifNull: [{ $arrayElemAt: ['$reviewStats.count', 0] }, 0],
          },
          // Sponsoring actif si is_sponsored=true ET sponsor_until > now (ou null = permanent)
          is_sponsor_active: {
            $and: [
              '$is_sponsored',
              {
                $or: [
                  { $eq: ['$sponsor_until', null] },
                  { $gt: ['$sponsor_until', now] },
                ],
              },
            ],
          },
        },
      },
      { $project: { reviewStats: 0 } },
      {
        $sort: {
          is_sponsor_active: -1,
          star_rating: -1,
          average_rating: -1,
          chosen_count: -1,
        },
      },
      { $limit: Number(limit) },
    ]);
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content/restaurants?city_id=1&cuisine=moroccan&tags=halal,vegetarian&budget_max=50
router.get('/restaurants', async (req, res) => {
  try {
    const {
      city_id,
      cuisine,
      tags,
      budget_min,
      budget_max,
      limit = 9,
    } = req.query;
    const match = {};
    if (city_id) match.city_id = city_id;
    if (cuisine) match.cuisine = new RegExp(cuisine, 'i');
    // Filtrer par tags alimentaires (OR : le restaurant doit avoir AU MOINS UN des tags demandés)
    if (tags) {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (tagList.length > 0) match.dietary_tags = { $in: tagList };
    }
    if (budget_min || budget_max) {
      match.price_usd = {};
      if (budget_min) match.price_usd.$gte = Number(budget_min);
      if (budget_max) match.price_usd.$lte = Number(budget_max);
    }
    const restaurants = await Restaurant.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'reviews',
          let: { itemId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$element_type', 'restaurant'] },
                    { $eq: ['$element_id', '$$itemId'] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                avg: { $avg: '$rating' },
                count: { $sum: 1 },
              },
            },
          ],
          as: 'reviewStats',
        },
      },
      {
        $addFields: {
          average_rating: {
            $ifNull: [{ $arrayElemAt: ['$reviewStats.avg', 0] }, null],
          },
          review_count: {
            $ifNull: [{ $arrayElemAt: ['$reviewStats.count', 0] }, 0],
          },
        },
      },
      { $project: { reviewStats: 0 } },
      { $limit: Number(limit) },
    ]);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content/activities?city_id=1&categories=quad,culinary&budget_max=50&limit=10
// Tri : sponsorisés actifs en tête, puis avg_rating desc, puis chosen_count desc
router.get('/activities', async (req, res) => {
  try {
    const {
      city_id,
      category,
      categories,
      budget_min,
      budget_max,
      limit = 20,
    } = req.query;
    const match = {};
    if (city_id) match.city_id = city_id;
    // Support catégorie unique ou liste (ex: categories=quad,culinary)
    if (categories) {
      const cats = categories.split(',').map((c) => new RegExp(c.trim(), 'i'));
      match.category = { $in: cats };
    } else if (category) {
      match.category = new RegExp(category, 'i');
    }
    if (budget_min || budget_max) {
      match.price_usd = {};
      if (budget_min) match.price_usd.$gte = Number(budget_min);
      if (budget_max) match.price_usd.$lte = Number(budget_max);
    }
    const now = new Date();
    const activities = await Activity.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'reviews',
          let: { itemId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$element_type', 'activity'] },
                    { $eq: ['$element_id', '$$itemId'] },
                    { $eq: ['$status', 'approved'] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                avg: { $avg: '$rating' },
                count: { $sum: 1 },
              },
            },
          ],
          as: 'reviewStats',
        },
      },
      {
        $addFields: {
          average_rating: {
            $ifNull: [{ $arrayElemAt: ['$reviewStats.avg', 0] }, null],
          },
          review_count: {
            $ifNull: [{ $arrayElemAt: ['$reviewStats.count', 0] }, 0],
          },
          is_sponsor_active: {
            $and: [
              '$is_sponsored',
              {
                $or: [
                  { $eq: ['$sponsor_until', null] },
                  { $gt: ['$sponsor_until', now] },
                ],
              },
            ],
          },
        },
      },
      { $project: { reviewStats: 0 } },
      {
        $sort: {
          is_sponsor_active: -1,
          average_rating: -1,
          chosen_count: -1,
        },
      },
      { $limit: Number(limit) },
    ]);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content/hotels/:id
router.get('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content/restaurants/:id
router.get('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content/activities/:id
router.get('/activities/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Not found' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content/reviews/mine  → avis de l'utilisateur connecté
router.get('/reviews/mine', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user_id: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content/reviews/:element_type/:element_id  → uniquement les avis approuvés
router.get('/reviews/:element_type/:element_id', async (req, res) => {
  try {
    const reviews = await Review.find({
      element_type: req.params.element_type,
      element_id: req.params.element_id,
      status: 'approved',
    })
      .populate('user_id', 'name avatar_url')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/content/reviews
router.post('/reviews', auth, async (req, res) => {
  try {
    const { element_type, element_id, rating, text, verified_stay_dates } =
      req.body;
    // Vérifier si l'utilisateur a déjà laissé un avis pour cet élément
    const existing = await Review.findOne({
      user_id: req.user._id,
      element_type,
      element_id,
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: 'Vous avez déjà laissé un avis pour cet élément.' });
    }
    // Statut 'pending' par défaut → Admin doit approuver avant publication
    const review = await Review.create({
      element_type,
      element_id,
      user_id: req.user._id,
      rating,
      text,
      verified_stay_dates,
      status: 'pending',
    });
    await review.populate('user_id', 'name avatar_url');
    res.status(201).json({
      ...review.toObject(),
      message: 'Avis soumis, en attente de modération.',
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: 'Vous avez déjà laissé un avis pour cet élément.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/content/reviews/:id  → modifier son propre avis
router.patch('/reviews/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Avis introuvable.' });
    if (review.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Non autorisé.' });
    }
    const { rating, text } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (text !== undefined) review.text = text;
    await review.save();
    await review.populate('user_id', 'name avatar_url');
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/content/reviews/:id  → supprimer son propre avis
router.delete('/reviews/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Avis introuvable.' });
    if (review.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Non autorisé.' });
    }
    await review.deleteOne();
    res.json({ message: 'Avis supprimé.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
