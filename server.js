//server main
const path = require("path");
const fs = require("fs");

const express = require("express");
const app = express();


const port = 3001;
const mainDir = path.join(__dirname, "./Develop/public/");

app.use(express.static('./Develop/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//terminal log
app.listen(port, function () {
    console.log(`API server now on port ${port}! `);
})

//ROUTES
//route notes and for storage
//GET /notes should return the notes.html file -check
//link: http://localhost:3001/notes
app.get("/notes", function (req, res) {
    res.sendFile
        (path.join(mainDir, "notes.html")
        );
});

//GET /api/notes should read the db.json file 
app.get("/api/notes", function (req, res) {
    res.sendFile
        (path.join(__dirname, "./Develop/db/db.json")
        );
});

//and return all saved notes as json
//return new note to client
app.get("/api/notes/:id", function (req, res) {
    let noteStorage= JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    res.json
        (noteStorage[Number(req.params.id)]
        );
});

//route all other urls to index
//GET * should return the index.html file -check
//link: http://localhost:3001
app.get("*", function (req, res) {
    res.sendFile
        (path.join(mainDir, "index.html"));
});



//POST /api/notes should recieve a new note to save on the request body, add it to db.json file, and then return the new note to the client. Find a way to give each note a unique id when saved
app.post("/api/notes", function (req, res) {
    //recieve new note to save on REQUEST BODY
    let newNote = req.body;
    let noteContent = newNote
    //pull from current storage
    let noteStorage = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));

    //tried id npm packages in other versions but those kinda blew up. length as newest length. IDs unique to relative other entries, but get shifted over on delete
    //this might be the reason i cant get delete function working, dont know
    let noteID = (noteStorage.length).toString();
    newNote.id = noteID;

    noteStorage.push(newNote);

    //add note to db.json file
    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(noteStorage));


    console.log("New note created! Please see: root/Develop/db/db.json.", noteContent);
    res.json(noteStorage);
})

