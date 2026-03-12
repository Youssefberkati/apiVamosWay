const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar_url: String,
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function seedUsers() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/vamosway',
    );
    console.log('✅ Connected to MongoDB');

    // Delete existing users with these emails
    await User.deleteMany({
      email: { $in: ['test@gmail.com', 'test2@gmail.com'] },
    });
    console.log('✅ Cleared old test users');

    const users = [
      {
        email: 'test@gmail.com',
        password: '123456',
        name: 'Test User',
      },
      {
        email: 'test2@gmail.com',
        password: '123456',
        name: 'Test User 2',
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({
        email: user.email,
        password: hashedPassword,
        name: user.name,
      });
      await newUser.save();
      console.log(`✅ Created user: ${user.email}`);
    }

    console.log('\n✅ Seeding complete!');
    console.log('📧 Users created:');
    console.log('  - test@gmail.com / 123456');
    console.log('  - test2@gmail.com / 123456');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedUsers();
