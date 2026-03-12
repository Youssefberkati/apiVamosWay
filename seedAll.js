/**
 * seedAll.js – Seed complet VamosWay
 * Crée 15 utilisateurs + 40+ itinéraires sur toutes les villes marocaines
 * Lance avec : node backend/seedAll.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vamosway';

// ─── Schémas inline ─────────────────────────────────────────────────────────
const User = require('./models/User');
const Itinerary = require('./models/Itinerary');

// ─── Photos des villes ──────────────────────────────────────────────────────
const CITY_PHOTOS = {
  1: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80', // Marrakech
  2: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80', // Essaouira
  3: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=600&q=80', // Fès
  4: 'https://images.unsplash.com/photo-1574954909378-7c2c8fc0fb38?w=600&q=80', // Casablanca
  5: 'https://images.unsplash.com/photo-1580094333632-438bdc04f79f?w=600&q=80', // Rabat
  6: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', // Tanger
  7: 'https://images.unsplash.com/photo-1523491811048-1a2be5f7b6f1?w=600&q=80', // Agadir
  8: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', // Chefchaouen
  9: 'https://images.unsplash.com/photo-1556387853-4f7f2b6a5857?w=600&q=80', // Meknès
  10: 'https://images.unsplash.com/photo-1543832923-44667a44c8aa?w=600&q=80', // Ouarzazate
  11: 'https://images.unsplash.com/photo-1596389960720-56ed6c289e76?w=600&q=80', // Dakhla
  12: 'https://images.unsplash.com/photo-1517143526340-bfcb089d9b39?w=600&q=80', // Ifrane
};

// ─── Données utilisateurs ────────────────────────────────────────────────────
const USERS_DATA = [
  {
    email: 'anas@vamosway.com',
    password: '123456',
    name: 'Anas El Amrani',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Passionné de road trips et de street food 🌍',
    home_city: 'Marrakech',
    nationality: 'Marocain',
    travel_style: 'comfort',
    visited: ['Marrakech', 'Essaouira', 'Fès', 'Casablanca'],
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    email: 'sofia@vamosway.com',
    password: '123456',
    name: 'Sofia Benali',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Photographe de voyage, à la recherche des lumières parfaites.',
    home_city: 'Casablanca',
    nationality: 'Marocaine',
    travel_style: 'comfort',
    visited: ['Casablanca', 'Rabat', 'Tanger', 'Chefchaouen'],
    languages: ['Français', 'Anglais', 'Espagnol'],
  },
  {
    email: 'youssef@vamosway.com',
    password: '123456',
    name: 'Youssef Tazi',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Amoureux des kasbahs et du désert marocain.',
    home_city: 'Ouarzazate',
    nationality: 'Marocain',
    travel_style: 'budget',
    visited: ['Ouarzazate', 'Marrakech', 'Fès'],
    languages: ['Arabe', 'Français', 'Tamazight'],
  },
  {
    email: 'layla@vamosway.com',
    password: '123456',
    name: 'Layla Chraibi',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Je voyage pour manger. 🍽️ La gastronomie est mon passeport.',
    home_city: 'Fès',
    nationality: 'Marocaine',
    travel_style: 'comfort',
    visited: ['Fès', 'Meknès', 'Ifrane', 'Rabat'],
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    email: 'karim@vamosway.com',
    password: '123456',
    name: 'Karim Ouazzani',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'Surfeur, kite-boarder et fan de côtes atlantiques.',
    home_city: 'Dakhla',
    nationality: 'Marocain',
    travel_style: 'budget',
    visited: ['Dakhla', 'Agadir', 'Essaouira'],
    languages: ['Arabe', 'Français', 'Darija'],
  },
  {
    email: 'marie@vamosway.com',
    password: '123456',
    name: 'Marie Dubois',
    avatar: 'https://i.pravatar.cc/150?img=25',
    bio: 'Française amoureuse du Maroc depuis mon premier voyage à Chefchaouen 💙',
    home_city: 'Paris',
    nationality: 'Française',
    travel_style: 'comfort',
    visited: ['Chefchaouen', 'Tanger', 'Fès', 'Marrakech'],
    languages: ['Français', 'Anglais'],
  },
  {
    email: 'hassan@vamosway.com',
    password: '123456',
    name: 'Hassan Idrissi',
    avatar: 'https://i.pravatar.cc/150?img=33',
    bio: 'Guide local à Fès. Je connais chaque ruelle de la médina.',
    home_city: 'Fès',
    nationality: 'Marocain',
    travel_style: 'comfort',
    visited: ['Fès', 'Meknès', 'Casablanca', 'Rabat', 'Tanger'],
    languages: ['Arabe', 'Français', 'Anglais', 'Espagnol', 'Tamazight'],
  },
  {
    email: 'nora@vamosway.com',
    password: '123456',
    name: 'Nora Berrada',
    avatar: 'https://i.pravatar.cc/150?img=44',
    bio: 'Blogueuse voyage & lifestyle. Je partage mes coups de cœur marocains 🌹',
    home_city: 'Rabat',
    nationality: 'Marocaine',
    travel_style: 'luxury',
    visited: [
      'Rabat',
      'Casablanca',
      'Marrakech',
      'Agadir',
      'Essaouira',
      'Chefchaouen',
    ],
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    email: 'carlos@vamosway.com',
    password: '123456',
    name: 'Carlos Mendez',
    avatar: 'https://i.pravatar.cc/150?img=51',
    bio: 'Espagnol féru de culture berbère et de médinas.',
    home_city: 'Madrid',
    nationality: 'Espagnol',
    travel_style: 'budget',
    visited: ['Tanger', 'Chefchaouen', 'Fès', 'Meknès', 'Casablanca'],
    languages: ['Espagnol', 'Français', 'Anglais', 'Arabe'],
  },
  {
    email: 'aicha@vamosway.com',
    password: '123456',
    name: 'A\u00efcha Rhandour',
    avatar: 'https://i.pravatar.cc/150?img=60',
    bio: "Randonneuse dans les montagnes de l'Atlas. La nature avant tout.",
    home_city: 'Ifrane',
    nationality: 'Marocaine',
    travel_style: 'budget',
    visited: ['Ifrane', 'Mekn\u00e8s', 'F\u00e8s', 'Ouarzazate'],
    languages: ['Arabe', 'Fran\u00e7ais', 'Tamazight'],
  },
  {
    email: 'mehdi@vamosway.com',
    password: '123456',
    name: 'Mehdi Alaoui',
    avatar: 'https://i.pravatar.cc/150?img=67',
    bio: 'Entrepreneur tech & voyageur de luxe. Les riads sont ma passion.',
    home_city: 'Casablanca',
    nationality: 'Marocain',
    travel_style: 'luxury',
    visited: ['Casablanca', 'Marrakech', 'Essaouira', 'Agadir', 'Dakhla'],
    languages: ['Français', 'Anglais', 'Arabe'],
  },
  {
    email: 'salma@vamosway.com',
    password: '123456',
    name: 'Salma Kettani',
    avatar: 'https://i.pravatar.cc/150?img=36',
    bio: 'Architecte passionnée par le patrimoine architectural marocain.',
    home_city: 'Meknès',
    nationality: 'Marocaine',
    travel_style: 'comfort',
    visited: ['Meknès', 'Fès', 'Marrakech', 'Ouarzazate', 'Rabat'],
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    email: 'adam@vamosway.com',
    password: '123456',
    name: 'Adam Leblanc',
    avatar: 'https://i.pravatar.cc/150?img=18',
    bio: 'Canadien à la découverte des saveurs et couleurs du Maroc.',
    home_city: 'Montréal',
    nationality: 'Canadien',
    travel_style: 'comfort',
    visited: ['Marrakech', 'Fès', 'Chefchaouen'],
    languages: ['Français', 'Anglais'],
  },
  {
    email: 'fatima@vamosway.com',
    password: '123456',
    name: 'Fatima Azzouzi',
    avatar: 'https://i.pravatar.cc/150?img=47',
    bio: 'Passionnée de trekking dans le Haut-Atlas et de culture locale.',
    home_city: 'Agadir',
    nationality: 'Marocaine',
    travel_style: 'budget',
    visited: ['Agadir', 'Essaouira', 'Marrakech', 'Ifrane', 'Ouarzazate'],
    languages: ['Arabe', 'Français', 'Tamazight'],
  },
  {
    email: 'test@gmail.com',
    password: '123456',
    name: 'Test User',
    avatar: null,
    bio: null,
    home_city: null,
    nationality: null,
    travel_style: null,
    visited: [],
    languages: [],
  },
];

// ─── Templates d'itinéraires ─────────────────────────────────────────────────
const ITINERARY_TEMPLATES = [
  // MARRAKECH
  {
    title: '3 jours à Marrakech – Médina & Riads',
    city_id: '1',
    budget: 320,
    days: 3,
  },
  {
    title: 'Week-end Marrakech : Souks & Hammams',
    city_id: '1',
    budget: 280,
    days: 2,
  },
  {
    title: 'Marrakech Gastronomie – Street Food & Resto étoilés',
    city_id: '1',
    budget: 450,
    days: 4,
  },
  {
    title: 'Marrakech + Ouarzazate – Désert & Kasbahs',
    city_id: '1',
    budget: 680,
    days: 5,
  },
  {
    title: 'Luxe à Marrakech – Palaces & Spas',
    city_id: '1',
    budget: 1200,
    days: 4,
  },
  {
    title: 'Marrakech en famille – Safari urbain',
    city_id: '1',
    budget: 390,
    days: 3,
  },
  // ESSAOUIRA
  {
    title: 'Essaouira – Plage, Vent & Médina bleue',
    city_id: '2',
    budget: 260,
    days: 3,
  },
  {
    title: 'Weekend Essaouira : Boho & Surf',
    city_id: '2',
    budget: 210,
    days: 2,
  },
  {
    title: 'Essaouira culturelle – Art & Musique Gnaoua',
    city_id: '2',
    budget: 300,
    days: 3,
  },
  // FÈS
  {
    title: 'Fès Impériale – 4 jours dans la plus ancienne médina',
    city_id: '3',
    budget: 350,
    days: 4,
  },
  {
    title: 'Tanneries de Fès & Artisanat traditionnel',
    city_id: '3',
    budget: 290,
    days: 3,
  },
  {
    title: 'Fès + Meknès – Duo de villes impériales',
    city_id: '3',
    budget: 420,
    days: 4,
  },
  {
    title: 'Fès spirituelle – Mosquées, Zaouias & Médersas',
    city_id: '3',
    budget: 310,
    days: 3,
  },
  // CASABLANCA
  {
    title: 'Casablanca Moderne – Architecture & Nightlife',
    city_id: '4',
    budget: 480,
    days: 3,
  },
  {
    title: 'Hassan II & Corniche – Best of Casa',
    city_id: '4',
    budget: 350,
    days: 2,
  },
  {
    title: 'Casablanca Business & Détente',
    city_id: '4',
    budget: 520,
    days: 3,
  },
  // RABAT
  {
    title: 'Rabat Royale – Châteaux, Tour Hassan & Kasbah',
    city_id: '5',
    budget: 320,
    days: 3,
  },
  {
    title: 'Rabat + Casablanca – La côte atlantique',
    city_id: '5',
    budget: 450,
    days: 4,
  },
  {
    title: 'Rabat culturelle – Musées & Oudayas',
    city_id: '5',
    budget: 280,
    days: 2,
  },
  // TANGER
  {
    title: 'Tanger – Entre deux continents',
    city_id: '6',
    budget: 310,
    days: 3,
  },
  {
    title: 'Tanger & Chefchaouen Combo Road Trip',
    city_id: '6',
    budget: 490,
    days: 4,
  },
  {
    title: 'Détroit de Gibraltar & Cap Spartel',
    city_id: '6',
    budget: 260,
    days: 2,
  },
  // AGADIR
  {
    title: 'Agadir Beach Holiday – Plages & Bronzage',
    city_id: '7',
    budget: 380,
    days: 4,
  },
  {
    title: 'Agadir Active – Surf, Kite & Quad',
    city_id: '7',
    budget: 420,
    days: 3,
  },
  {
    title: 'Agadir + Essaouira – La côte atlantique sud',
    city_id: '7',
    budget: 550,
    days: 5,
  },
  // CHEFCHAOUEN
  {
    title: 'Chefchaouen – La Ville Bleue en 3 jours',
    city_id: '8',
    budget: 240,
    days: 3,
  },
  {
    title: 'Rif Marocain – Chefchaouen & Randonnée',
    city_id: '8',
    budget: 290,
    days: 3,
  },
  {
    title: 'Chefchaouen Instagram – Les plus beaux spots photo',
    city_id: '8',
    budget: 220,
    days: 2,
  },
  // MEKNÈS
  {
    title: 'Meknès Impériale – Bab Mansour & Palais Royal',
    city_id: '9',
    budget: 280,
    days: 2,
  },
  {
    title: 'Meknès + Volubilis – Ruines Romaines',
    city_id: '9',
    budget: 320,
    days: 3,
  },
  // OUARZAZATE
  {
    title: 'Ouarzazate – Hollywood du Désert & Ait Ben Haddou',
    city_id: '10',
    budget: 440,
    days: 3,
  },
  {
    title: 'Sud Marocain – Dunes de Merzouga & Ouarzazate',
    city_id: '10',
    budget: 680,
    days: 5,
  },
  {
    title: 'Ouarzazate Cinéma – Studios & Kasbahs',
    city_id: '10',
    budget: 350,
    days: 3,
  },
  // DAKHLA
  {
    title: 'Dakhla Kite Camp – Paradis des sports nautiques',
    city_id: '11',
    budget: 520,
    days: 5,
  },
  {
    title: 'Dakhla Nature – Lagune & Désert Atlantique',
    city_id: '11',
    budget: 430,
    days: 4,
  },
  // IFRANE
  {
    title: 'Ifrane – La Suisse du Maroc en hiver',
    city_id: '12',
    budget: 290,
    days: 3,
  },
  {
    title: 'Atlas Moyen – Ifrane, Azrou & Cèdres',
    city_id: '12',
    budget: 250,
    days: 2,
  },
];

// ─── Logique de seed ──────────────────────────────────────────────────────────
async function seedAll() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connecté');

    // Supprimer les anciennes données
    const emails = USERS_DATA.map((u) => u.email);
    await User.deleteMany({ email: { $in: emails } });
    console.log('🗑️  Anciens utilisateurs supprimés');

    // Créer les utilisateurs
    const createdUsers = [];
    for (const u of USERS_DATA) {
      const user = new User({
        email: u.email,
        password: u.password,
        name: u.name,
        avatar_url: u.avatar || null,
        bio: u.bio || null,
        home_city: u.home_city || null,
        nationality: u.nationality || null,
        travel_style: u.travel_style || null,
        visited_cities: u.visited || [],
        languages_spoken: u.languages || [],
      });
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Créé: ${user.name} (${user.email})`);
    }

    // Supprimer tous les anciens itinéraires
    await Itinerary.deleteMany({});
    console.log('🗑️  Anciens itinéraires supprimés');

    // Créer les itinéraires (distribués entre les utilisateurs)
    const itineraries = [];
    for (let i = 0; i < ITINERARY_TEMPLATES.length; i++) {
      const tpl = ITINERARY_TEMPLATES[i];
      // Distribuer les itinéraires entre les utilisateurs (sauf le dernier "test")
      const userIdx = i % (createdUsers.length - 1);
      const user = createdUsers[userIdx];

      itineraries.push({
        user_id: user._id,
        title: tpl.title,
        city_id: tpl.city_id,
        budget_usd: tpl.budget,
        duration_days: tpl.days,
        cover_image_url: CITY_PHOTOS[tpl.city_id] || '',
        is_public: true,
        days: [],
      });
    }

    const created = await Itinerary.insertMany(itineraries);
    console.log(`\n✅ ${created.length} itinéraires créés`);

    // Résumé
    console.log('\n📊 RÉSUMÉ DU SEED:');
    console.log(`   👥 ${createdUsers.length} utilisateurs créés`);
    console.log(`   🗺️  ${created.length} itinéraires créés sur 12 villes`);
    console.log('\n🔑 Comptes de test:');
    USERS_DATA.slice(0, 5).forEach((u) => {
      console.log(`   📧 ${u.email} / ${u.password}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Seed terminé !');
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

seedAll();
