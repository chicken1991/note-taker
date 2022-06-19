const express = require('express');
const path = require('path');

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
    console.log(`${req.method} request received`);

})

app.listen(PORT, () =>
    console.log(`App listening at localhost:${PORT}`)
);