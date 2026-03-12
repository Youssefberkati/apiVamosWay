const mongoose = require('mongoose');
require('dotenv').config();

const { Hotel, Restaurant, Activity } = require('./models/Content');

// ================================
// ESSAOUIRA DATA — city_id = "2"
// ================================

const hotels = [
  {
    city_id: '2',
    name: 'Heure Bleue Palais',
    address: '2 Rue Ibn Batouta, Essaouira',
    coordinates: { lat: 31.5141, lng: -9.7696 },
    price_usd: 180,
    description:
      "Palace du XIXe siècle restauré avec goût. Toit-terrasse avec vue sur l'Atlantique, piscine chauffée, spa hammam, restaurant gastronomique. Le meilleur hôtel de la ville.",
    image_url:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    photos: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    ],
    booking_link: 'https://www.heurebleue.com',
    star_rating: 5,
    amenities: [
      'wifi',
      'pool',
      'breakfast',
      'restaurant',
      'spa',
      'gym',
      'parking',
      'ac',
    ],
    cancellation_policy: 'free',
    bed_type: 'double',
    bed_count: 1,
  },
  {
    city_id: '2',
    name: 'Riad Baladin',
    address: 'Rue Touahen, Médina, Essaouira',
    coordinates: { lat: 31.5128, lng: -9.7681 },
    price_usd: 90,
    description:
      "Riad artistique au cœur de la Médina classée UNESCO. Chambres décorées d'œuvres d'artistes locaux, terrasse avec vue sur les remparts, petit-déjeuner maison.",
    image_url:
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    photos: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    ],
    booking_link: 'https://www.booking.com',
    star_rating: 3,
    amenities: ['wifi', 'breakfast', 'ac'],
    cancellation_policy: 'free',
    bed_type: 'double',
    bed_count: 1,
  },
  {
    city_id: '2',
    name: 'Sofitel Essaouira Mogador',
    photos: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1547581528-7a47038806e0?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    ],
    address: "Stade Municipal, Route d'Agadir, Essaouira",
    coordinates: { lat: 31.4985, lng: -9.7812 },
    price_usd: 220,
    description:
      "Resort de luxe face à l'océan. Golf 18 trous, thalassothérapie, 4 restaurants, piscines chauffées. À 15 min de la Médina, parfait pour familles et golfeurs.",
    image_url:
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    booking_link: 'https://www.sofitel.com',
    star_rating: 5,
    amenities: [
      'wifi',
      'pool',
      'breakfast',
      'restaurant',
      'spa',
      'gym',
      'parking',
      'ac',
      'pet_friendly',
    ],
    cancellation_policy: 'partial',
    bed_type: 'family',
    bed_count: 2,
  },
  {
    city_id: '2',
    name: "Villa de l'Ô",
    photos: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    ],
    address: '14 Rue Mohamed Ben Massoud, Essaouira',
    coordinates: { lat: 31.5115, lng: -9.7672 },
    price_usd: 120,
    description:
      "Maison d'hôtes intime avec 6 chambres thématiques. Patio avec fontaine, bibliothèque, tables d'hôtes le soir. Atmosphère calme et raffinée loin de l'agitation.",
    image_url:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    booking_link: 'https://www.booking.com',
    star_rating: 3,
    amenities: ['wifi', 'breakfast', 'ac', 'parking'],
    photos: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    ],
    cancellation_policy: 'partial',
    bed_type: 'double',
    bed_count: 1,
  },
  {
    city_id: '2',
    name: 'Auberge Tangaro',
    address: 'Route de Diabat, 3km Essaouira',
    coordinates: { lat: 31.4902, lng: -9.7634 },
    price_usd: 55,
    description:
      'Auberge bohème dans les dunes, à 3 km de la ville. Ambiance hippie-chic, chevaux sur la plage, piscine naturelle, cuisine bio. Cadre magique hors du temps.',
    image_url:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    booking_link: 'https://www.booking.com',
    star_rating: 2,
    amenities: ['wifi', 'breakfast', 'pool'],
    photos: [
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
    cancellation_policy: 'free',
    bed_type: 'single',
    bed_count: 1,
  },
  {
    city_id: '2',
    name: 'Riad Zahra',
    address: 'Derb Laâlouj, Médina, Essaouira',
    coordinates: { lat: 31.5135, lng: -9.7688 },
    price_usd: 45,
    description:
      'Petit riad familial authentique dans la Médina historique. Patio fleuri, terrasse vue mer, ambiance conviviale. Idéal pour les voyageurs avec petit budget.',
    image_url:
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
    booking_link: 'https://www.booking.com',
    star_rating: 2,
    amenities: ['wifi', 'breakfast'],
    cancellation_policy: 'strict',
    bed_type: 'single',
    bed_count: 1,
  },
];

const restaurants = [
  {
    city_id: '2',
    name: 'Restaurant Les Alizés',
    cuisine: 'Fruits de mer & Marocain',
    address: '26 Rue de la Skala, Essaouira',
    coordinates: { lat: 31.5142, lng: -9.7702 },
    price_usd: 20,
    description:
      "Vue imprenable sur les remparts et l'Atlantique. Spécialité de poissons et fruits de mer ultra-frais pêchés le matin. Tagine de crevettes et bastilla au poisson incontournables.",
    image_url:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    booking_link: '',
    dietary_tags: ['halal', 'seafood', 'traditional'],
  },
  {
    city_id: '2',
    name: "Port de Pêche d'Essaouira",
    cuisine: 'Poisson grillé / Street food',
    address: 'Port de Pêche, Essaouira',
    coordinates: { lat: 31.5164, lng: -9.7731 },
    price_usd: 7,
    description:
      "Les grillades du port : choisissez votre poisson directement chez le pêcheur, il est grillé sur place. Sardines, calamars, crevettes royales. L'expérience la plus authentique.",
    image_url:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    booking_link: '',
    dietary_tags: ['halal', 'seafood', 'street_food'],
  },
  {
    city_id: '2',
    name: 'Taros Café',
    cuisine: 'Fusion & Cocktails',
    address: 'Place Moulay Hassan, Essaouira',
    coordinates: { lat: 31.5127, lng: -9.7693 },
    price_usd: 15,
    description:
      "Bar-restaurant branché sur la place principale avec terrasse panoramique. Concerts live gnaoua et jazz le soir, cocktails créatifs, cuisine fusion. L'âme de la ville.",
    image_url:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    booking_link: '',
    dietary_tags: ['alcohol', 'vegetarian', 'seafood'],
  },
  {
    city_id: '2',
    name: 'Silvestro',
    cuisine: 'Italien & Méditerranéen',
    address: '70 Rue Laâlouj, Médina',
    coordinates: { lat: 31.5131, lng: -9.7685 },
    price_usd: 18,
    description:
      'Adresse italienne culte tenue par un chef sicilien. Pâtes fraîches, pizzas au feu de bois, vins importés. Une parenthèse européenne dans la Médina marocaine.',
    image_url:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    booking_link: '',
    dietary_tags: ['alcohol', 'vegetarian', 'vegan', 'low_salt'],
  },
  {
    city_id: '2',
    name: 'Café de la Plage',
    cuisine: 'Marocain / Snacks',
    address: "Boulevard Mohammed V, Plage d'Essaouira",
    coordinates: { lat: 31.5072, lng: -9.7748 },
    price_usd: 8,
    description:
      'Face à la grande plage battue par les vents. Couscous du vendredi, sandwichs kefta, smoothies de fruits. Parfait après une session de kitesurf ou une promenade sur la plage.',
    image_url:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    booking_link: '',
    dietary_tags: ['halal', 'traditional', 'low_salt', 'street_food'],
  },
  {
    city_id: '2',
    name: 'Côté Plage',
    cuisine: 'Poisson & Marocain moderne',
    address: 'Corniche, Essaouira',
    coordinates: { lat: 31.5098, lng: -9.7742 },
    price_usd: 22,
    description:
      "Restaurant gastronomique avec terrasse surplombant l'Atlantique. Carpaccio de daurade, pastilla au homard, crème brûlée à la rose. Service élégant, coucher de soleil garanti.",
    image_url:
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
    booking_link: '',
    dietary_tags: ['halal', 'seafood', 'low_salt'],
  },
];

const activities = [
  {
    city_id: '2',
    name: "Médina d'Essaouira (UNESCO)",
    category: 'Culture & Patrimoine',
    address: 'Médina, Essaouira',
    coordinates: { lat: 31.5128, lng: -9.7681 },
    price_usd: 0,
    duration_minutes: 150,
    description:
      "Médina portugaise du XVIIIe siècle classée au Patrimoine Mondial de l'UNESCO. Remparts blancs et bleus, ruelles pavées, artisans du bois de thuya. Atmosphère unique très différente de Marrakech.",
    image_url:
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    booking_link: '',
  },
  {
    city_id: '2',
    name: 'Kitesurf & Windsurf sur la Plage',
    category: 'Sports & Aventure',
    address: "Plage d'Essaouira, 3 km au sud",
    coordinates: { lat: 31.4985, lng: -9.7731 },
    price_usd: 60,
    duration_minutes: 180,
    description:
      "Essaouira est la capitale mondiale du windsurf et kitesurf grâce aux vents d'alizés constants. Cours pour débutants disponibles. Location de matériel. Les meilleurs spots sur 3 km de plage.",
    image_url:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    booking_link: '',
  },
  {
    city_id: '2',
    name: 'Skala de la Ville (Remparts)',
    category: 'Culture & Patrimoine',
    address: 'Rue de la Skala, Essaouira',
    coordinates: { lat: 31.5152, lng: -9.7715 },
    price_usd: 0,
    duration_minutes: 60,
    description:
      "Promenade sur les remparts du XVIIIe siècle face à l'Atlantique. Canons portugais alignés, vue spectaculaire sur la mer et les îles Purpuraires. Coucher de soleil magique.",
    image_url:
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800',
    booking_link: '',
  },
  {
    city_id: '2',
    name: 'Festival Gnaoua (Musique du Monde)',
    category: 'Culture & Musique',
    address: 'Place Moulay Hassan & scènes en ville',
    coordinates: { lat: 31.5127, lng: -9.7693 },
    price_usd: 0,
    duration_minutes: 240,
    description:
      "Festival international de musique gnaoua chaque juin (450 000 visiteurs). Concerts gratuits dans toute la ville, artistes du monde entier. Essaouira vibre le reste de l'année avec les musiciens de rue.",
    image_url:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    booking_link: '',
  },
  {
    city_id: '2',
    name: 'Atelier Thuya & Marqueterie',
    category: 'Artisanat & Culture',
    address: 'Rue de la Skala, Coopérative Artisanale',
    coordinates: { lat: 31.5145, lng: -9.7705 },
    price_usd: 10,
    duration_minutes: 60,
    description:
      'Essaouira est renommée pour ses marqueteries en bois de thuya (arbre endémique du Maroc). Visite des ateliers de la Coopérative Artisanale, démonstration et vente directe des artisans.',
    image_url:
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
    booking_link: '',
  },
  {
    city_id: '2',
    name: 'Balade à Cheval sur la Plage',
    category: 'Sports & Nature',
    address: "Plage d'Essaouira (départ Diabat)",
    coordinates: { lat: 31.4902, lng: -9.7634 },
    price_usd: 35,
    duration_minutes: 120,
    description:
      "Randonnée à cheval ou dromadaire sur la longue plage sauvage jusqu'au village de Diabat et les ruines du château de Hendrix. Passage par les arganiers et les dunes.",
    image_url:
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800',
    booking_link: '',
  },
  {
    city_id: '2',
    name: 'Îles Purpuraires (Réserve ornithologique)',
    category: 'Nature & Écotourisme',
    address: "Face au Port d'Essaouira",
    coordinates: { lat: 31.5215, lng: -9.7868 },
    price_usd: 25,
    duration_minutes: 180,
    description:
      "Archipel protégé classé réserve naturelle. Ancienne résidence de Juba II et reine Cléopâtre Séléné. Colonie de faucons d'Éléonore, lézards endémiques. Excursion en bateau depuis le port.",
    image_url:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
    booking_link: '',
  },
  {
    city_id: '2',
    name: 'Arganier & Coopérative de femmes',
    category: 'Gastronomie & Culture',
    address: "Route d'Agadir, km 12, Essaouira",
    coordinates: { lat: 31.4756, lng: -9.7234 },
    price_usd: 0,
    duration_minutes: 90,
    description:
      "Visite d'une coopérative d'huile d'argan tenue par des femmes berbères. Démonstration du pressage traditionnel, dégustation d'amlou (beurre d'argan au miel), achat direct. Commerce équitable.",
    image_url:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    booking_link: '',
  },
];

async function seedEssaouira() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/vamosway',
    );
    console.log('✅ Connected to MongoDB');

    // Clean existing Essaouira data
    await Promise.all([
      Hotel.deleteMany({ city_id: '2' }),
      Restaurant.deleteMany({ city_id: '2' }),
      Activity.deleteMany({ city_id: '2' }),
    ]);
    console.log('✅ Cleared old Essaouira data');

    // Insert all
    const [insertedHotels, insertedRestaurants, insertedActivities] =
      await Promise.all([
        Hotel.insertMany(hotels),
        Restaurant.insertMany(restaurants),
        Activity.insertMany(activities),
      ]);

    console.log(`\n✅ Seeding Essaouira terminé !`);
    console.log(`   🏨 ${insertedHotels.length} hôtels`);
    console.log(`   🍽️  ${insertedRestaurants.length} restaurants`);
    console.log(`   🎯 ${insertedActivities.length} activités`);
    console.log(
      `\n   Total: ${insertedHotels.length + insertedRestaurants.length + insertedActivities.length} lieux`,
    );

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedEssaouira();
