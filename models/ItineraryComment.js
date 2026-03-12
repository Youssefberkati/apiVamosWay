const mongoose = require('mongoose');

const itineraryCommentSchema = new mongoose.Schema(
  {
    itinerary_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Itinerary',
      required: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: { type: String, required: true, minlength: 10, maxlength: 300 },
    parent_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItineraryComment',
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ItineraryComment', itineraryCommentSchema);
