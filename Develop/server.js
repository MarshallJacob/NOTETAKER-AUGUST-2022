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

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, noteData);
    res.json(newNote);
});

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, noteData);
    res.json(true);
});


app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
