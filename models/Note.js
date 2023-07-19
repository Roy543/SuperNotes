const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    person: String,
    topic: String,
    note: String,
    created_at: Date,
    photo: String
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
