require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Assure UTF-8 pour toutes les réponses
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/auth')); // alias pour /api/users/:userId
app.use('/api/itineraries', require('./routes/itineraries'));
app.use('/api/content', require('./routes/content'));
app.use('/api/admin', require('./routes/admin'));

app.get('/health', (_, res) =>
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  }),
);

// Connexion MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vamosway';
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB connecté : ${MONGO_URI}`);
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Backend VamosWay sur http://0.0.0.0:${PORT}`),
    );
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1);
  });
