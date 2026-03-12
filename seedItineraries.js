const mongoose = require('mongoose');
const User = require('./models/User');
const Itinerary = require('./models/Itinerary');

const MONGO_URI = 'mongodb://localhost:27017/vamosway';

const ITINERARY_TEMPLATES = [
  {
    title: '3 jours à Marrakech - Culture & Riads',
    city_id: '1',
    budget_usd: 350,
    duration_days: 3,
    cover_image_url: 'https://picsum.photos/seed/marrakech1/500/300',
  },
  {
    title: '5 jours Marrakech + Essaouira Combo',
    city_id: '1',
    budget_usd: 650,
    duration_days: 5,
    cover_image_url: 'https://picsum.photos/seed/marrakech2/500/300',
  },
  {
    title: 'Weekend Essaouira - Plage & Détente',
    city_id: '2',
    budget_usd: 280,
    duration_days: 2,
    cover_image_url: 'https://picsum.photos/seed/essaouira1/500/300',
  },
  {
    title: 'Marrakech Gastronomie & Marchés',
    city_id: '1',
    budget_usd: 320,
    duration_days: 4,
    cover_image_url: 'https://picsum.photos/seed/marrakech3/500/300',
  },
];

async function seedItineraries() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connecté');

    const user = await User.findOne({});
    if (!user) {
      console.log(
        '❌ Aucun utilisateur trouvé. Veuillez créer un utilisateur.',
      );
      await mongoose.connection.close();
      return;
    }

    // Supprimer les anciens itinéraires (optionnel)
    await Itinerary.deleteMany({});
    console.log('🔄 Itinéraires précédents supprimés');

    const itineraries = ITINERARY_TEMPLATES.map((it) => ({
      user_id: user._id,
      title: it.title,
      city_id: it.city_id,
      budget_usd: it.budget_usd,
      duration_days: it.duration_days,
      cover_image_url: it.cover_image_url,
      is_public: true,
      days: [],
    }));

    const created = await Itinerary.insertMany(itineraries);
    console.log(
      `✅ ${created.length} itinéraires créés avec couvertures d'image`,
    );

    created.forEach((it) => {
      console.log(`  📅 ${it.title} (${it.city_id}) - ${it.budget_usd}$`);
    });

    await mongoose.connection.close();
    console.log('✅ Connexion fermée');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

seedItineraries();
