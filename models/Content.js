const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema(
  { lat: Number, lng: Number },
  { _id: false },
);

const hotelSchema = new mongoose.Schema(
  {
    city_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    address: String,
    coordinates: coordinatesSchema,
    price_usd: { type: Number, default: 0 },
    description: String,
    image_url: String,
    // Tableau de photos pour le carousel (inclut image_url comme première photo)
    photos: [{ type: String }],
    booking_link: String,
    star_rating: { type: Number, min: 1, max: 5, default: 3 },
    // Équipements : 'wifi', 'pool', 'breakfast', 'parking', 'gym', 'ac', 'restaurant', 'spa', 'pet_friendly'
    amenities: [{ type: String }],
    // Politique d'annulation : 'free' | 'partial' | 'strict'
    cancellation_policy: {
      type: String,
      enum: ['free', 'partial', 'strict'],
      default: 'partial',
    },
    // Type de lit : 'single' | 'double' | 'twin' | 'suite' | 'family'
    bed_type: {
      type: String,
      enum: ['single', 'double', 'twin', 'suite', 'family'],
      default: 'double',
    },
    bed_count: { type: Number, default: 1 },
    chosen_count: { type: Number, default: 0 },
    is_sponsored: { type: Boolean, default: false },
    sponsor_until: { type: Date, default: null },
  },
  { timestamps: true },
);

const restaurantSchema = new mongoose.Schema(
  {
    city_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    cuisine: String,
    address: String,
    coordinates: coordinatesSchema,
    price_usd: { type: Number, default: 0 },
    description: String,
    image_url: String,
    booking_link: String,
    // ex: ['halal', 'alcohol', 'vegetarian', 'vegan', 'low_salt', 'seafood', 'traditional', 'street_food']
    dietary_tags: [{ type: String }],
  },
  { timestamps: true },
);

const activitySchema = new mongoose.Schema(
  {
    city_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: String,
    address: String,
    coordinates: coordinatesSchema,
    price_usd: { type: Number, default: 0 },
    duration_minutes: { type: Number, default: 60 },
    description: String,
    image_url: String,
    booking_link: String,
    chosen_count: { type: Number, default: 0 },
    is_sponsored: { type: Boolean, default: false },
    sponsor_until: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = {
  Hotel: mongoose.model('Hotel', hotelSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Activity: mongoose.model('Activity', activitySchema),
};
