const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const path = require('path');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // Redirect unauthenticated requests to the login page
        res.redirect('/login');
    }
}


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

//routes for all the files

router.get('/signup', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});


router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
  

router.get('/profile',ensureAuthenticated, function(req, res) {
    res.render('profile', { user: req.user });
});

router.get('/camera',ensureAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, '../public/camera.html'));
});

module.exports = router;