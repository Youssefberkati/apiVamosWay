const express = require('express');
const jwt = require('jsonwebtoken');
const Itinerary = require('../models/Itinerary');
const ItineraryComment = require('../models/ItineraryComment');
const ItineraryLike = require('../models/ItineraryLike');
const { Hotel, Restaurant, Activity } = require('../models/Content');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/itineraries  — itinéraires publics
router.get('/', async (req, res) => {
  try {
    const { city_id, budget_max, duration_days, limit = 20 } = req.query;
    const filter = { is_public: true };
    if (city_id) filter.city_id = city_id;
    if (budget_max) filter.budget_usd = { $lte: Number(budget_max) };
    if (duration_days) filter.duration_days = Number(duration_days);

    const itineraries = await Itinerary.find(filter)
      .populate('user_id', 'name avatar_url')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    // Enrichir chaque itinéraire avec le nombre de likes et de commentaires
    const enriched = await Promise.all(
      itineraries.map(async (itin) => {
        const obj = itin.toObject();
        const [likes_count, comments_count] = await Promise.all([
          ItineraryLike.countDocuments({ itinerary_id: itin._id }),
          ItineraryComment.countDocuments({ itinerary_id: itin._id }),
        ]);
        return { ...obj, likes_count, comments_count };
      }),
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/itineraries/mine  — itinéraires de l'utilisateur connecté
router.get('/mine', auth, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user_id: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/itineraries/:id
router.get('/:id', async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate(
      'user_id',
      'name avatar_url',
    );
    if (!itinerary)
      return res.status(404).json({ error: 'Itinéraire introuvable' });

    if (req.query.populate === 'true') {
      const itineraryObj = itinerary.toObject();
      const populatedDays = await Promise.all(
        itineraryObj.days.map(async (day) => {
          const elements = await Promise.all(
            day.elements.map(async (el) => {
              let content = null;
              try {
                if (el.element_type === 'hotel') {
                  content = await Hotel.findById(el.element_id)
                    .select('name address image_url price_usd coordinates')
                    .lean();
                } else if (el.element_type === 'restaurant') {
                  content = await Restaurant.findById(el.element_id)
                    .select(
                      'name address image_url price_usd coordinates cuisine',
                    )
                    .lean();
                } else if (el.element_type === 'activity') {
                  content = await Activity.findById(el.element_id)
                    .select(
                      'name address image_url price_usd coordinates category',
                    )
                    .lean();
                }
              } catch {}
              return { ...el, content };
            }),
          );
          return { ...day, elements };
        }),
      );
      return res.json({ ...itineraryObj, days: populatedDays });
    }

    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/itineraries
router.post('/', auth, async (req, res) => {
  try {
    const { city_id, title, budget_usd, duration_days, days } = req.body;
    const itinerary = await Itinerary.create({
      user_id: req.user._id,
      city_id,
      title,
      budget_usd,
      duration_days,
      days: days || [],
    });
    res.status(201).json(itinerary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/itineraries/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!itinerary)
      return res.status(404).json({ error: 'Itinéraire introuvable' });

    Object.assign(itinerary, req.body);
    await itinerary.save();
    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/itineraries/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!result)
      return res.status(404).json({ error: 'Itinéraire introuvable' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── LIKES ────────────────────────────────────────────────────────────────────

// GET /api/itineraries/:id/likes/count  — nombre de likes + isLiked pour l'user connecté
router.get('/:id/likes/count', async (req, res) => {
  try {
    const count = await ItineraryLike.countDocuments({
      itinerary_id: req.params.id,
    });
    let isLiked = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(
          authHeader.split(' ')[1],
          process.env.JWT_SECRET,
        );
        const like = await ItineraryLike.findOne({
          itinerary_id: req.params.id,
          user_id: decoded.id,
        });
        isLiked = !!like;
      } catch {}
    }
    res.json({ count, isLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/itineraries/:id/like  — liker (idempotent)
router.post('/:id/like', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary)
      return res.status(404).json({ error: 'Itinéraire introuvable' });
    if (!itinerary.is_public)
      return res.status(403).json({ error: 'Itinéraire privé' });
    if (String(itinerary.user_id) === String(req.user._id))
      return res
        .status(400)
        .json({ error: 'Impossible de liker son propre itinéraire' });

    await ItineraryLike.findOneAndUpdate(
      { itinerary_id: req.params.id, user_id: req.user._id },
      { itinerary_id: req.params.id, user_id: req.user._id },
      { upsert: true, new: true },
    );
    const count = await ItineraryLike.countDocuments({
      itinerary_id: req.params.id,
    });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/itineraries/:id/like  — unliker
router.delete('/:id/like', auth, async (req, res) => {
  try {
    await ItineraryLike.findOneAndDelete({
      itinerary_id: req.params.id,
      user_id: req.user._id,
    });
    const count = await ItineraryLike.countDocuments({
      itinerary_id: req.params.id,
    });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── COMMENTAIRES ─────────────────────────────────────────────────────────────

// GET /api/itineraries/:id/comments  — liste tous les commentaires (groupés client-side)
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await ItineraryComment.find({
      itinerary_id: req.params.id,
    })
      .populate('user_id', 'name avatar_url')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ comments, total: comments.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/itineraries/:id/comments  — publier un commentaire ou une réponse
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary)
      return res.status(404).json({ error: 'Itinéraire introuvable' });
    if (!itinerary.is_public)
      return res
        .status(403)
        .json({ error: 'Commentaires désactivés pour les itinéraires privés' });

    const { text, parent_comment_id } = req.body;
    if (!text || text.trim().length < 10)
      return res
        .status(400)
        .json({ error: 'Le commentaire doit contenir au moins 10 caractères' });
    if (text.trim().length > 300)
      return res
        .status(400)
        .json({ error: 'Le commentaire ne peut pas dépasser 300 caractères' });

    // Vérifier que le parent existe et est un top-level comment
    if (parent_comment_id) {
      const parent = await ItineraryComment.findById(parent_comment_id);
      if (!parent)
        return res
          .status(404)
          .json({ error: 'Commentaire parent introuvable' });
      if (parent.parent_comment_id)
        return res.status(400).json({
          error: 'Impossible de répondre à une réponse (1 niveau max)',
        });
    }

    const comment = await ItineraryComment.create({
      itinerary_id: req.params.id,
      user_id: req.user._id,
      text: text.trim(),
      parent_comment_id: parent_comment_id || null,
    });

    const populated = await ItineraryComment.findById(comment._id)
      .populate('user_id', 'name avatar_url')
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/itineraries/:id/comments/:commentId  — supprimer (auteur ou propriétaire itinéraire)
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await ItineraryComment.findById(req.params.commentId);
    if (!comment)
      return res.status(404).json({ error: 'Commentaire introuvable' });

    const itinerary = await Itinerary.findById(req.params.id);
    const isOwnComment = String(comment.user_id) === String(req.user._id);
    const isItineraryOwner =
      itinerary && String(itinerary.user_id) === String(req.user._id);

    if (!isOwnComment && !isItineraryOwner)
      return res.status(403).json({ error: 'Non autorisé' });

    // Supprimer aussi les réponses si c'est un commentaire top-level
    if (!comment.parent_comment_id) {
      await ItineraryComment.deleteMany({ parent_comment_id: comment._id });
    }
    await comment.deleteOne();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
