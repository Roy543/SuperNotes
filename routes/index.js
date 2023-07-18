const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User'); // Adjust this path if necessary

router.post('/signup', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            return res.send(err);
        }
        passport.authenticate('local')(req, res, () => {
            res.send('Signed up!');
        });
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send('Logged in!');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send('Logged out!');
});

router.get('/checkAuthentication', (req, res) => {
    if(req.isAuthenticated()){
        res.send('You are authenticated');
    } else {
        res.send('You are not authenticated');
    }
});

module.exports = router;