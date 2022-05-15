const rateLimit = require('express-rate-limit');

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Trop de tentative de connexion ont était sur cette adresse, réessayez plus tard',
})