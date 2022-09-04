const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const PORT = process.env.PORT || 3003;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// retreiving the files and directing them to the right place.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});
app.get('/api/notes', (req, res) => {
    res.json(noteData.slice(1));
});

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, noteData);
    res.json(newNote);
});




app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
