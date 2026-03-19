const mongoose = require('mongoose');

// Votre URI configurée
const MONGO_URI = 'mongodb+srv://berkati:Anasanas111@cluster0.dp6vatn.mongodb.net/vamosway?retryWrites=true&w=majority';

async function seedDatabase() {
    try {
        console.log("⏳ Connexion à MongoDB Atlas...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connexion réussie !");

        // Nettoyage des collections
        const collections = ['users', 'hotels', 'restaurants', 'activities', 'itineraries', 'itinerarycomments', 'itinerarylikes'];
        for (const col of collections) {
            await mongoose.connection.collection(col).deleteMany({});
        }

        // --- 1. USERS (20) ---
        const users = Array.from({ length: 20 }).map((_, i) => ({
            _id: new mongoose.Types.ObjectId(),
            __v: 0,
            name: i === 0 ? "Anas Berkati" : `Voyageur Marrakech ${i + 1}`,
            email: i === 0 ? "berkati@example.com" : `user${i + 1}@vamosway.ma`,
            password: "hashed_password_123",
            role: i === 0 ? "admin" : "traveler",
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        await mongoose.connection.collection('users').insertMany(users);
        const userIds = users.map(u => u._id);

        // --- 2. HOTELS (25 Réels) ---
        const hotelNames = [
            "La Mamounia", "Royal Mansour", "Amanjena", "Selman Marrakech", "El Fenn",
            "Radisson Blu Carré Eden", "Es Saadi Resort", "Riad Kniza", "Fairmont Royal Palm", "Movenpick Mansour Eddahbi",
            "The Oberoi", "Sofitel Lounge & Spa", "Riad Farnatchi", "Hivernage Hotel & Spa", "Savoy Le Grand Hotel",
            "La Sultana", "Villa des Orangers", "Les Jardins de la Koutoubia", "Kenzi Farah", "Pestana CR7",
            "Riad Kheirredine", "Barceló Palmeraie", "Tigmiza Boutique", "Mandarin Oriental", "Four Seasons Resort"
        ];

        const hotels = hotelNames.map((name, i) => ({
            _id: new mongoose.Types.ObjectId(),
            __v: 0,
            name: name,
            address: `${i + 1} Avenue de la Ménara, Marrakech`,
            city_id: "marrakech_01",
            price_usd: 150 + (i * 20),
            star_rating: 5,
            amenities: ["Wifi", "Spa", "Piscine"],
            coordinates: { lat: 31.62 + (i * 0.001), lng: -7.99 - (i * 0.001) },
            description: `L'expérience ultime du luxe à ${name}.`,
            image_url: `https://picsum.photos/seed/${name}/800/600`,
            photos: ["img1.jpg", "img2.jpg"],
            bed_count: 1,
            bed_type: "King Size",
            booking_link: "https://vamosway.com/book",
            cancellation_policy: "Flexible",
            chosen_count: 0,
            is_sponsored: i < 2,
            sponsor_until: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        await mongoose.connection.collection('hotels').insertMany(hotels);
        const hotelIds = hotels.map(h => h._id);

        // --- 3. RESTAURANTS (25 Réels) ---
        const restoNames = [
            "Nomad", "Le Jardin", "Al Fassia", "Comptoir Darna", "Bacha Coffee",
            "Dar Yacout", "Plus 61", "Naranj", "Azar", "La Famille",
            "Kabana", "Dar Moha", "Le Palace", "Pepe Nero", "Bo & Zin",
            "Sahbi Sahbi", "Zeitoun Cafe", "Grand Café de la Poste", "Café des Épices", "L'Adresse",
            "Mama Mia", "Ksar Es Saoussan", "La Trattoria", "Limoni", "Le Studio"
        ];

        const restaurants = restoNames.map((name, i) => ({
            _id: new mongoose.Types.ObjectId(),
            __v: 0,
            name: name,
            address: `Rue de la Liberté, Marrakech`,
            city_id: "marrakech_01",
            cuisine: i % 2 === 0 ? "Marocaine" : "Fusion",
            price_usd: 20 + i,
            description: `Le restaurant ${name} est une référence gastronomique.`,
            dietary_tags: ["Vegan", "Halal"],
            coordinates: { lat: 31.63 + (i * 0.001), lng: -8.00 + (i * 0.001) },
            image_url: `https://picsum.photos/seed/${name}/800/600`,
            booking_link: "https://vamosway.com/table",
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        await mongoose.connection.collection('restaurants').insertMany(restaurants);
        const restoIds = restaurants.map(r => r._id);

        // --- 4. ITINERAIRES (Nécessaires pour les commentaires) ---
        const itineraries = Array.from({ length: 5 }).map((_, i) => ({
            _id: new mongoose.Types.ObjectId(),
            __v: 0,
            title: `Escale à Marrakech ${i + 1}`,
            user_id: userIds[i],
            city_id: "marrakech_01",
            budget_usd: 400,
            duration_days: 1,
            is_public: true,
            cover_image_url: "https://picsum.photos/800/400",
            days: [{
                _id: new mongoose.Types.ObjectId(),
                day_number: 1,
                elements: [{
                    day_number: 1,
                    element_id: restoIds[i],
                    element_type: "restaurant",
                    time_of_day: "lunch"
                }]
            }],
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        await mongoose.connection.collection('itineraries').insertMany(itineraries);
        const itinIds = itineraries.map(it => it._id);

        // --- 5. COMMENTAIRES (50) & RÉPONSES (20) ---
        const comments = Array.from({ length: 50 }).map((_, i) => ({
            _id: new mongoose.Types.ObjectId(),
            __v: 0,
            itinerary_id: itinIds[i % itinIds.length],
            user_id: userIds[(i + 1) % userIds.length],
            text: `Superbe sélection ! Le restaurant ${restoNames[i % 25]} est top.`,
            parent_comment_id: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        await mongoose.connection.collection('itinerarycomments').insertMany(comments);
        const parentIds = comments.map(c => c._id);

        const replies = Array.from({ length: 20 }).map((_, i) => ({
            _id: new mongoose.Types.ObjectId(),
            __v: 0,
            itinerary_id: itinIds[i % itinIds.length],
            user_id: userIds[0],
            text: "Merci pour ton retour ! Ravi que ça t'ait plu.",
            parent_comment_id: parentIds[i],
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        await mongoose.connection.collection('itinerarycomments').insertMany(replies);

        // --- 6. LIKES (30) ---
        const likes = Array.from({ length: 30 }).map((_, i) => ({
            _id: new mongoose.Types.ObjectId(),
            __v: 0,
            itinerary_id: itinIds[i % itinIds.length],
            user_id: userIds[(i + 2) % userIds.length],
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        await mongoose.connection.collection('itinerarylikes').insertMany(likes);

        console.log("✅ Seeding terminé : 25 Hotels, 25 Restaurants, 20 Users, 70 Comms, 30 Likes.");

    } catch (err) {
        console.error("❌ Erreur critique :", err);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();