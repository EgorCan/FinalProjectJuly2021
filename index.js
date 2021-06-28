
const express = require('express');
const config = require("./config/datadase")
const bcrypt = require("bcryptjs");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require("connect-flash");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const User = require("./models/user");
const passport = require("passport");

const app = express();
app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

const urlEncodeParser = bodyParser.urlencoded({ extended: false });
// const jquery = require("jquery");

mongoose.connect(config.database)
const db = mongoose.connection;

db.once("open", () => {
    console.log("Connected to DB")
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Example app running on port ${port}`);
});

// const mongoClient = require("mongodb").MongoClient;
// const dburl = "mongodb://localhost:27017"
// mongoClient.connect(dburl, function (err, client) {
//     console.log("Connected with DB");
// });

const mainMenu = [
    { id: 1, name: "all" },
    { id: 2, name: "summer" },
    { id: 3, name: "winter" },
]

app.set('view engine', 'pug');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// routes
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
//Login
app.post("/account", (req, res, next) => {
    console.log("here");
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/account",
        failureFlash: true
    })(req, res, next)
})

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


//Sign up
app.post('/signup', (req, res) => {
    const user = new User();
    user.name = req.body.name
    user.email = req.body.email
    user.username = req.body.username
    user.password = req.body.password

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                console.log(err)
            }
            user.password = hash;
            user.save((err) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash("success", "You are successfully signed up")
                    res.redirect("/account")
                }
            });
        });
    });

});

app.get('/signup', (req, res) => {
    res.render("signup")
});


