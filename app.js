const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const indexRouter = require('./routes/index');

const app = express();

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB, define routes, and start server...

app.use('/', indexRouter);

mongoose.connect('mongodb://localhost/myapp', {useNewUrlParser: true, useUnifiedTopology: true});
app.listen(3000, () => console.log('Server is running on port 3000'));

module.exports = router;