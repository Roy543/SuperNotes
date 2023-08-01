const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const Note = require ('./models/Note');
const indexRouter = require('./routes/index');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


//for dynamic
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));


// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Connect to MongoDB, define routes, and start server...

app.use('/', indexRouter);
app.use(express.static('public'));


mongoose.connect('mongodb://localhost/myapp', {useNewUrlParser: true, useUnifiedTopology: true});
app.listen(3000, () => console.log('Server is running on port 3000'));

module.exports = router;