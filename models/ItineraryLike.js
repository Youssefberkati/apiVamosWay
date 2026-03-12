const mongoose = require('mongoose');

const itineraryLikeSchema = new mongoose.Schema(
  {
    itinerary_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Itinerary',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

// Index unique : un utilisateur ne peut liker qu'une seule fois
itineraryLikeSchema.index({ itinerary_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('ItineraryLike', itineraryLikeSchema);
