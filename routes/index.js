const express = require('express');
const router = express.Router();
const passport = require('passport');
const faceapi = require('@vladmandic/face-api');
const User = require('../models/User');
const path = require('path');
const Note = require('../models/Note');

function euclideanDistance(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('Arrays should have the same length');
    }

    var squareSum = 0;
    for (var i = 0; i < arr1.length; i++) {
        squareSum += Math.pow(arr1[i] - arr2[i], 2);
    }

    return Math.sqrt(squareSum);
}


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // Redirect unauthenticated requests to the login page
        res.redirect('/login');
    }
}

//facesearch routing

router.post('/facesearch', async function (req, res, next) {
    const descriptor = req.body.descriptor;

    // You'll need to implement logic to compare the descriptor
    // with the descriptors in the notes to find matches
    // Here's a pseudo-code example:

    const matchedNotes = await findMatchingNotes(descriptor);

    res.json(matchedNotes);
});

async function findMatchingNotes(descriptor) {
    // Parse the descriptor string back into an array, if it is a string
    var queryDescriptor;
    if (typeof descriptor === "string") {
        queryDescriptor = JSON.parse(descriptor);
    } else {
        queryDescriptor = descriptor;
    }
    queryDescriptor = Object.values(queryDescriptor); // Convert object to array

    // Get all the notes from the database
    var notes = await Note.find({});

    // Filter the notes to only include those with a matching descriptor
    var matchedNotes = notes.filter(note => {
        // Parse the note's descriptor string back into an array, if it is a string
        var noteDescriptor = (typeof note.faceDescriptor === "string") ? JSON.parse(note.faceDescriptor) : note.faceDescriptor;

        // Log the lengths of the two descriptors
        console.log(`queryDescriptor length: ${queryDescriptor.length}, noteDescriptor length: ${noteDescriptor.length}`);

        // Compare the query descriptor with the note's descriptor
        var distance = euclideanDistance(queryDescriptor, noteDescriptor);

        // Consider the descriptors to match if the distance is below a certain threshold
        return distance < 0.6;
    });


    return matchedNotes;
}

//sending face descriptor to the server

router.post('/facesearch', async function (req, res, next) {
    // Extract the face descriptor from the request body
    const descriptor = req.body.descriptor;
    console.log(descriptor);

    // Convert the descriptor back to a Float32Array
    const descriptorFloat32Array = Float32Array.from(descriptor);

    // Query the database for all notes
    const notes = await Note.find();

    // code to compare the descriptors and send the matching notes back to the client here

    const matchingNotes = notes.filter(note => {
        const noteDescriptor = Float32Array.from(note.faceDescriptor);
        const distance = faceapi.euclideanDistance(descriptorFloat32Array, noteDescriptor);
        return distance <= 0.6; // Threshold for deciding whether descriptors match
    });

    // Send the matching notes back to the client
    res.json(matchingNotes);

});


//facesearch page routing

router.get('/facesearch', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/facesearch.html'));
});

//creating new note
router.post('/newnote', async function (req, res, next) {
    var personName = req.body.personName;
    var noteTopic = req.body.noteTopic;
    var noteText = req.body.noteText;
    var photo = req.body.photo;  // This is the data URI of the photo
    var descriptor = req.body.descriptor;  // It is an array now

    // Check if descriptor is not empty and is an array
    if (descriptor && Array.isArray(descriptor) && descriptor.length > 0) {
        var newNote = new Note({
            personName: personName,
            noteTopic: noteTopic,
            noteText: noteText,
            photo: photo,
            faceDescriptor: descriptor,
            userId: req.user._id
        });

        try {
            await newNote.save();
            res.send('Note created successfully');
        } catch (err) {
            return next(err);
        }
    } else {
        return next(new Error('Descriptor is missing or empty'));
    }
});




//getting all note to the profile page

router.get('/profile', ensureAuthenticated, async function (req, res) {
    try {
        let notes = await Note.find({ userId: req.user._id });
        res.render('profile', { user: req.user, notes: notes });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving notes.');
    }
});

//Signup page

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


//Login Logout page

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

router.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

router.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});


router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});


router.get('/profile', ensureAuthenticated, function (req, res) {
    res.render('profile', { user: req.user });
});

router.get('/newnote', ensureAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, '../public/newnote.html'));
});


module.exports = router;