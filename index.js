
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const urlEncodeParser = bodyParser.urlencoded({ extended: false });

const jquery = require("jquery");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/trailUser")
const db = mongoose.connection;

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Example app running on port ${port}`);
});

const mongoClient = require("mongodb").MongoClient;
const dburl = "mongodb://localhost:27017"
mongoClient.connect(dburl, function (err, client) {
    console.log("Connected with DB");
});

const mainMenu = [
    { id: 1, name: "all" },
    { id: 2, name: "summer" },
    { id: 3, name: "winter" },
]

app.set('view engine', 'pug');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('index', { mainMenu: mainMenu });
});

app.get('/test', (req, res) => {
    res.render('test');
});

app.get('/contact', (req, res) => {
    res.render('contact', { mainMenu: mainMenu });
});

app.get('/merch', (req, res) => {
    res.render('merch', { mainMenu: mainMenu });
});

app.get('/account', (req, res) => {
    res.render('account', { mainMenu: mainMenu });
});

app.get('/shoppingCart', (req, res) => {
    res.render('shoppingCart', { mainMenu: mainMenu });
});

app.get("/mainMenu/:id", (req, res) => {
    const selectedId = req.params.id;
    let trailName;
    if (selectedId === '1') {
        trailName = 'all';
    } else if (selectedId === '2') {
        trailName = 'summer';
    } else if (selectedId === '3') {
        trailName = 'winter';
    }
    let selectedMainMenuArray = mainMenu.filter(menuElement => {
        return menuElement.id === +selectedId;
    });
    selectedMenuElement = selectedMainMenuArray[0];
    res.render(trailName, { menuElement: selectedMenuElement });
});

// const mainMessage = {};
// app.get("/mainMessage/", (req, res) =>{
// });




