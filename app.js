const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const faceapi = require('@vladmandic/face-api');
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

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));

// After your Passport strategies and before app routes

passport.serializeUser((user, done) => {
    done(null, user.id); // This stores the user.id in the session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        console.error("Error deserializing user:", err);
        done(err, null);
    }
});



// Connect to MongoDB, define routes, and start server...

app.use('/', indexRouter);
app.use(express.static('public'));


// mongoose.connect('mongodb://localhost/myapp', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb://127.0.0.1:27017/face-app",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log(`connection sucessful`);
}).catch((e)=>{
    console.log(`no connection`);
})
app.listen(3000, () => console.log('Server is running on port 3000'));

module.exports = router;