const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true, trim: true },
    avatar_url: { type: String, default: null },
    bio: { type: String, default: null, maxlength: 300, trim: true },
    home_city: { type: String, default: null, trim: true },
    visited_cities: { type: [String], default: [] },
    nationality: { type: String, default: null, trim: true },
    travel_style: {
      type: String,
      enum: ['budget', 'comfort', 'luxury', null],
      default: null,
    },
    languages_spoken: { type: [String], default: [] },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    avatar_url: this.avatar_url,
    bio: this.bio,
    home_city: this.home_city,
    visited_cities: this.visited_cities,
    nationality: this.nationality,
    travel_style: this.travel_style,
    languages_spoken: this.languages_spoken,
    member_since: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
