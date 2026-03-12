const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    element_type: {
      type: String,
      enum: ['hotel', 'restaurant', 'activity'],
      required: true,
    },
    element_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, required: true, maxlength: 1000 },
    helpful_count: { type: Number, default: 0 },
    verified_stay_dates: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    admin_notes: { type: String, default: null },
  },
  { timestamps: true },
);

// Un seul avis par utilisateur par élément
reviewSchema.index(
  { user_id: 1, element_type: 1, element_id: 1 },
  { unique: true },
);

module.exports = mongoose.model('Review', reviewSchema);
