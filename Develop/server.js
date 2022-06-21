const express = require('express');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const { readFromFile, writeToFile } = require('./utils/fsutils.js');
// const db = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.json());

app.use(express.static('public'));

//GET route for root
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//directs user to notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET request path for the api so that notes can be rendered
app.get('/api/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/db/db.json'))
);

//TODO: POST requests to write to /db/db.json
app.post('/api/notes', (req,res) => {
    console.info(`${req.method} request received`);
    let db = require('./db/db.json');
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            id: randomUUID(),
            title,
            text,
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
        db.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
            if (err) { console.log(err); }
            else { console.log("File written successfully\n"); }
        });
        //TODO: refresh the displayed notes list
    } else {
        res.status(500).json('Error in creating new note');
    }
})

app.delete(`/api/notes/:id`, (req, res) => {
    const noteID = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
        let tmpArray = json.filter((db) => db.id !== noteID);
        console.log(tmpArray);

        writeToFile('./db/db.json', tmpArray);

        res.json(`Item ${noteID} has been deleted`);
});
});

app.listen(PORT, () =>
    console.log(`App listening at localhost:${PORT}`)
);