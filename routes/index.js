const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User'); // Adjust this path if necessary

router.post('/signup', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred during sign up.');
            return;
        }
        passport.authenticate('local')(req, res, () => {
            res.send('Signed up!');
        });
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred during login.');
            return;
        }
        if (!user) {
            res.status(401).send('Invalid username or password.');
            return;
        }
        req.login(user, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('An error occurred during login.');
                return;
            }
            res.send('Logged in!');
        });
    })(req, res, next);
});

module.exports = router;