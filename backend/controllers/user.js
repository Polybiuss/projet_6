const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/User');

exports.signup = (req, res, next) => {
    if (!/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(req.body.email)) {   // Test password strength
        return res.status(401).json({ error: 'veuillez renseigner une adresse mail correcte !' });
      } else {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'utilisateur crée !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})
    .then(user =>{
        if (!user) {
            return res.status(401).json({ error: 'utilisateur non trouvée !'})
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'mot de passe incorrecte !'})
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.TOKEN,
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};