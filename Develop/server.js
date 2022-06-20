const express = require('express');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

const PORT = 3001;

const app = express();

app.use(express.json());

app.use(express.static('public'));

//GET route for root
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//TODO: POST requests to write to /db/db.json
app.post('/api/notes', (req,res) => {
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
        fs.appendFile('./db/db.json', JSON.stringify(newNote), (err) => {
            if (err) { console.log(err); }
            else { console.log("File written successfully\n"); }
        });
    } else {
        res.status(500).json('Error in creating new note');
    }
})

app.listen(PORT, () =>
    console.log(`App listening at localhost:${PORT}`)
);