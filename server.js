const express = require('express');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const { readFromFile, writeToFile } = require('./utils/fsUtils.js');

//this is variable as db is modified and changes
var db = require('./db/db.json');

//listen port
const PORT = 3001;

// middlware
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

//catch-all sends any "other" page to home
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//TODO: POST requests to write to /db/db.json
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);
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
    } else {
        res.status(500).json('Error in creating new note');
    }
})

//DELETE route that filters the objects and removes the corresponding ID
app.delete(`/api/notes/:id`, (req, res) => {
    const noteID = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            let tmpArray = json.filter((dbase) => dbase.id !== noteID);

            writeToFile('./db/db.json', tmpArray);

            //This is very important, or else the old objects are retained after making a new note
            db = tmpArray;

            res.json(`Item ${noteID} has been deleted`);
        });
});

app.listen(PORT, () =>
    console.log(`App listening at localhost:${PORT}`)
);