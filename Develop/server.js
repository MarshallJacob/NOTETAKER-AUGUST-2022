const fs = require('fs');
const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const PORT = process.env.PORT || 3004;
const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// retreiving the files and directing them to the right place.
app.get('/api/notes', (req, res) => {
    res.json(noteData.slice(1));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// Function to create the note while also assigning an id in order to delete the note later.
function createNewNote(body, noteArray) {
    const newNote = body;
    if (!Array.isArray(noteArray))
        noteArray = [];    
    if (noteArray.length === 0)
        noteArray.push(0);
        body.id = noteArray[0];
        noteArray[0]++;
        noteArray.push(newNote);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(noteArray, null, 2)
    );
    return newNote;
};

// Posts the generated note 
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, noteData);
    res.json(newNote);
});

// Function to handle deleting the notes
function deleteNote(id, noteArray) {
    for (let i = 0; i < noteArray.length; i++) {
        let note = noteArray[i];
        if (note.id == id) {
            noteArray.splice(i, 1);

        fs.writeFileSync(
            path.join(__dirname, './db/db.json'),
            JSON.stringify(noteArray, null, 2)
        );
        break;
        }
    }
};
// Communicates with server to delete the note. 
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, noteData);
    res.json(true);
});


app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
