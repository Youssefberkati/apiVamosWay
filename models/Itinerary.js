const mongoose = require('mongoose');

const itineraryElementSchema = new mongoose.Schema(
  {
    element_type: {
      type: String,
      enum: ['hotel', 'restaurant', 'activity'],
      required: true,
    },
    element_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    day_number: { type: Number, required: true },
    time_of_day: {
      type: String,
      enum: ['breakfast', 'morning', 'lunch', 'afternoon', 'dinner', 'evening'],
      required: true,
    },
  },
  { _id: false },
);

const itineraryDaySchema = new mongoose.Schema(
  {
    day_number: { type: Number, required: true },
    day_date: { type: Date },
    description: String,
    elements: [itineraryElementSchema],
  },
  { _id: true },
);

const itinerarySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    city_id: { type: String, required: true },
    title: { type: String, required: true },
    budget_usd: { type: Number, default: 0 },
    duration_days: { type: Number, required: true },
    cover_image_url: { type: String, default: '' },
    is_public: { type: Boolean, default: true },
    days: [itineraryDaySchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
