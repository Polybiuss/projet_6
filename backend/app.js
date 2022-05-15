const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const dotenv = require("dotenv");
const helmet = require('helmet');
dotenv.config();
const rateLimit = require('express-rate-limit');

const accountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: 'Trop de tentative de connexion ont était sur cette adresse, réessayez plus tard',
});

const DB_URL = process.env.DB_URL;

app.use(express.json());

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

mongoose.connect( DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
});



app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', accountLimiter, userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;