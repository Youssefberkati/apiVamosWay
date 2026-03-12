const mongoose = require('mongoose');
require('dotenv').config();

const { Hotel, Restaurant, Activity } = require('./models/Content');

// ================================
// MARRAKECH DATA — city_id = "1"
// ================================

const hotels = [
  {
    city_id: '1',
    name: 'La Mamounia',
    address: 'Avenue Bab Jdid, Marrakech 40040',
    coordinates: { lat: 31.6214, lng: -7.9991 },
    price_usd: 450,
    description:
      "Palace légendaire du XVIIIe siècle, considéré comme l'un des plus beaux hôtels du monde. Jardins andalous, hammam royal, 3 restaurants étoilés.",
    image_url:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    photos: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1547581528-7a47038806e0?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
    booking_link: 'https://www.mamounia.com',
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
    city_id: '1',
    name: 'Riad Yasmine',
    address: 'Derb Sidi Yahia, Médina, Marrakech',
    coordinates: { lat: 31.6295, lng: -7.9811 },
    price_usd: 95,
    description:
      'Magnifique riad avec piscine turquoise au cœur de la Médina. Décoration traditionnelle, toit-terrasse panoramique, petit-déjeuner marocain inclus.',
    image_url:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    photos: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
    ],
    booking_link: 'https://www.booking.com',
    star_rating: 3,
    amenities: ['wifi', 'pool', 'breakfast', 'ac'],
    cancellation_policy: 'free',
    bed_type: 'double',
    bed_count: 1,
  },
  {
    city_id: '1',
    name: 'Royal Mansour',
    photos: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1547581528-7a47038806e0?w=800',
    ],
    address: 'Rue Abou Abbas El Sebti, Marrakech',
    coordinates: { lat: 31.6246, lng: -7.9969 },
    price_usd: 1200,
    description:
      'Hôtel de luxe ultra-exclusif avec 53 riads privés. Spa primé, jardins immenses, gastronomie française & marocaine. Ancienne résidence royale.',
    image_url:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    booking_link: 'https://www.royalmansour.com',
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
    bed_type: 'suite',
    bed_count: 1,
  },
  {
    city_id: '1',
    name: 'Riad Kniza',
    photos: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
    address: "34 Derb l'Hôtel, Bab Doukkala, Marrakech",
    coordinates: { lat: 31.634, lng: -7.9876 },
    price_usd: 180,
    description:
      "Riad du XVIIIe siècle classé monument historique. Collection d'antiquités, cuisine marocaine authentique, service personnalisé 5 étoiles.",
    image_url:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    booking_link: 'https://www.riadkniza.com',
    star_rating: 4,
    amenities: ['wifi', 'breakfast', 'restaurant', 'ac', 'parking'],
    photos: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1547581528-7a47038806e0?w=800',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    ],
    cancellation_policy: 'partial',
    bed_type: 'double',
    bed_count: 1,
  },
  {
    city_id: '1',
    name: 'Nobu Hotel Marrakech',
    address: 'Avenue de France, Hivernage, Marrakech',
    coordinates: { lat: 31.6188, lng: -7.9979 },
    price_usd: 280,
    description:
      'Design contemporain rencontre luxe marocain. Piscine à débordement, restaurant Nobu signature, spa exclusif dans le quartier branché Hivernage.',
    image_url:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    booking_link: 'https://www.nobuhotels.com',
    star_rating: 5,
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'gym', 'ac', 'parking'],
    photos: [
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
    cancellation_policy: 'free',
    bed_type: 'double',
    bed_count: 1,
  },
  {
    city_id: '1',
    name: 'Riad Charai',
    address: 'Derb Charai, Médina, Marrakech',
    coordinates: { lat: 31.6315, lng: -7.9842 },
    price_usd: 65,
    description:
      'Petit riad familial authentique, idéal pour les voyageurs qui veulent vivre comme les locaux. Patio fleuri, terrasse, hôtes chaleureux, bon rapport qualité-prix.',
    image_url:
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
    booking_link: 'https://www.booking.com',
    star_rating: 2,
    amenities: ['wifi', 'breakfast'],
    cancellation_policy: 'strict',
    bed_type: 'twin',
    bed_count: 2,
  },
];

const restaurants = [
  {
    city_id: '1',
    name: 'Le Jardin',
    cuisine: 'Marocain moderne',
    address: '32 Souk El Jeld, Sidi Abdelaziz, Médina',
    coordinates: { lat: 31.6318, lng: -7.9846 },
    price_usd: 25,
    description:
      'Restaurant caché dans un riad verdoyant. Terrasse sous les figuiers, cuisine marocaine revisitée, ambiance bohème. Le spot Instagram #1 de Marrakech.',
    image_url:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    booking_link: 'https://www.lejardin-marrakech.com',
    dietary_tags: ['halal', 'vegetarian', 'vegan', 'traditional'],
  },
  {
    city_id: '1',
    name: 'Café de France',
    cuisine: 'Marocain traditionnel',
    address: 'Place Jemaa el-Fna, Marrakech',
    coordinates: { lat: 31.6259, lng: -7.9894 },
    price_usd: 8,
    description:
      "Terrasse iconique donnant sur la Place Jemaa el-Fna. Parfait pour observer la place depuis le 1er étage. Thé à la menthe, jus d'orange frais, snacks locaux.",
    image_url:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    booking_link: '',
    dietary_tags: ['halal', 'traditional', 'low_salt'],
  },
  {
    city_id: '1',
    name: 'Nomad',
    cuisine: 'Fusion marocain-international',
    address: '1 Derb Aarjane, Rahba Lakdima, Médina',
    coordinates: { lat: 31.6325, lng: -7.9849 },
    price_usd: 20,
    description:
      'Rooftop design au cœur des souks. Vue panoramique sur les toits de la Médina, cuisine créative qui réinterprète les classiques marocains avec des produits locaux.',
    image_url:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    booking_link: 'https://nomadmarrakech.com',
    dietary_tags: ['halal', 'alcohol', 'vegetarian', 'seafood'],
  },
  {
    city_id: '1',
    name: 'Les Secrets de Marrakech',
    cuisine: 'Marocain traditionnel',
    address: '64 Rue de la Liberté, Guéliz',
    coordinates: { lat: 31.6356, lng: -8.0083 },
    price_usd: 30,
    description:
      'Le meilleur couscous et pastilla de la ville. Décoration luxueuse, spectacle de danse du ventre le soir, service de qualité. Idéal pour un dîner spécial.',
    image_url:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    booking_link: '',
    dietary_tags: ['halal', 'traditional', 'alcohol'],
  },
  {
    city_id: '1',
    name: 'Henna Café',
    cuisine: 'Végétarien / Marocain',
    address: '93 Aarset Aouzal, Médina',
    coordinates: { lat: 31.6338, lng: -7.9872 },
    price_usd: 12,
    description:
      'Café social qui emploie des personnes handicapées. Menu végétarien savoureux, henna artistique sur place, boutique équitable. Un repas qui a du sens.',
    image_url:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    booking_link: '',
    dietary_tags: ['halal', 'vegetarian', 'vegan', 'low_salt'],
  },
  {
    city_id: '1',
    name: 'Places à Manger Jemaa el-Fna',
    cuisine: 'Street food marocain',
    address: 'Place Jemaa el-Fna, stands 1-100',
    coordinates: { lat: 31.6258, lng: -7.9891 },
    price_usd: 5,
    description:
      "Les fameux stands de rue de la place ! Merguez grillées, escargots à la harissa, jus d'avocat, brochettes. Le vrai repas local à moins de 50 DH. Ambiance unique au monde.",
    image_url:
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
    booking_link: '',
    dietary_tags: ['halal', 'street_food', 'traditional'],
  },
];

const activities = [
  {
    city_id: '1',
    name: 'Place Jemaa el-Fna',
    category: 'Culture & Patrimoine',
    address: 'Place Jemaa el-Fna, Médina, Marrakech',
    coordinates: { lat: 31.6258, lng: -7.9891 },
    price_usd: 0,
    duration_minutes: 120,
    description:
      "La place la plus célèbre d'Afrique, classée UNESCO. Charmeurs de serpents, conteurs, musiciens Gnaoua. Magique le soir avec l'odeur des grillades et les acrobates.",
    image_url:
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    booking_link: '',
  },
  {
    city_id: '1',
    name: 'Souks de Marrakech',
    category: 'Shopping & Artisanat',
    address: 'Médina, au nord de la Place Jemaa el-Fna',
    coordinates: { lat: 31.6318, lng: -7.9846 },
    price_usd: 0,
    duration_minutes: 180,
    description:
      "Labyrinthe de souks thématiques : cuir (Souk des Teinturiers), épices, babouches, tapis, lampes en cuivre. L'art du marchandage est de rigueur. Incontournable.",
    image_url:
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800',
    booking_link: '',
  },
  {
    city_id: '1',
    name: 'Hammam El Bacha',
    category: 'Bien-être & Spa',
    address: '20 Rue Fatima Zohra, Médina',
    coordinates: { lat: 31.6348, lng: -7.9882 },
    price_usd: 15,
    duration_minutes: 90,
    description:
      "Hammam historique du début du XXe siècle, autrefois réservé aux nobles. Gommage traditionnel au savon beldi, massage à l'huile d'argan. Expérience authentique incontournable.",
    image_url:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    booking_link: '',
  },
  {
    city_id: '1',
    name: 'Palais de la Bahia',
    category: 'Culture & Patrimoine',
    address: 'Rue Riad Zitoun El Jdid, Médina',
    coordinates: { lat: 31.6219, lng: -7.9836 },
    price_usd: 7,
    duration_minutes: 60,
    description:
      "Chef-d'œuvre de l'architecture marocaine du XIXe siècle. 8 hectares de jardins, 160 pièces ornées de zellij et stucs sculptés. Construit par le grand vizir Ba Ahmed.",
    image_url:
      'https://images.unsplash.com/photo-1539020142390-1c7b5bfdBD6b?w=800',
    booking_link: '',
  },
  {
    city_id: '1',
    name: 'Jardin Majorelle & Musée Yves Saint Laurent',
    category: 'Culture & Nature',
    address: 'Rue Yves Saint Laurent, Guéliz',
    coordinates: { lat: 31.6417, lng: -8.0036 },
    price_usd: 18,
    duration_minutes: 90,
    description:
      'Jardin botanique emblématique fondé par le peintre Jacques Majorelle, restauré par YSL. Bambous géants, cactus rares, villa bleue cobalt. Musée YSL mitoyen.',
    image_url:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    booking_link: 'https://www.jardinmajorelle.com',
  },
  {
    city_id: '1',
    name: "Randonnée dans l'Atlas (journée)",
    category: 'Sports & Aventure',
    address: "Vallée de l'Ourika, 60km de Marrakech",
    coordinates: { lat: 31.3537, lng: -7.8898 },
    price_usd: 45,
    duration_minutes: 480,
    description:
      "Excursion d'une journée dans les montagnes de l'Atlas. Villages berbères, cascades d'Ourika, déjeuner chez l'habitant, mulets disponibles. Guide local inclus.",
    image_url:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    booking_link: '',
  },
  {
    city_id: '1',
    name: 'Tombeaux Saadiens',
    category: 'Culture & Patrimoine',
    address: 'Rue de la Kasbah, Médina',
    coordinates: { lat: 31.6177, lng: -7.9882 },
    price_usd: 7,
    duration_minutes: 45,
    description:
      'Mausolée royal du XVIe siècle redécouvert en 1917. 66 tombes de la dynastie saadienne dans un jardin secret. Décoration en marbre de Carrare et mosaïques dorées.',
    image_url:
      'https://images.unsplash.com/photo-1539020142390-1c7b5bfda321?w=800',
    booking_link: '',
  },
  {
    city_id: '1',
    name: 'Cours de cuisine marocaine',
    category: 'Gastronomie & Culture',
    address: 'Médina, Marrakech (selon prestataire)',
    coordinates: { lat: 31.6295, lng: -7.9811 },
    price_usd: 55,
    duration_minutes: 210,
    description:
      "Apprenez à préparer un tajine, du couscous et des pastillas avec une famille locale. Visite du souk des épices le matin, cuisine l'après-midi, repas en commun.",
    image_url:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    booking_link: '',
  },
  {
    city_id: '1',
    name: "Excursion en quad dans le désert d'Agafay",
    category: 'Sports & Aventure',
    address: "Désert d'Agafay, 30km de Marrakech",
    coordinates: { lat: 31.5167, lng: -8.15 },
    price_usd: 70,
    duration_minutes: 180,
    description:
      "Désert rocailleux à 30 min de Marrakech. Quad, buggy ou dromadaires dans un paysage lunaire face à l'Atlas. Coucher de soleil inoubliable, dîner berbère sous les étoiles.",
    image_url:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
    booking_link: '',
  },
];

async function seedMarrakech() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/vamosway',
    );
    console.log('✅ Connected to MongoDB');

    // Clean existing Marrakech data
    await Promise.all([
      Hotel.deleteMany({ city_id: '1' }),
      Restaurant.deleteMany({ city_id: '1' }),
      Activity.deleteMany({ city_id: '1' }),
    ]);
    console.log('✅ Cleared old Marrakech data');

    // Insert all
    const [insertedHotels, insertedRestaurants, insertedActivities] =
      await Promise.all([
        Hotel.insertMany(hotels),
        Restaurant.insertMany(restaurants),
        Activity.insertMany(activities),
      ]);

    console.log(`\n✅ Seeding Marrakech terminé !`);
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

seedMarrakech();
