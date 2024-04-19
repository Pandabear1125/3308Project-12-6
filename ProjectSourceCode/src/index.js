// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const fetch = require('node-fetch');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
    host: 'db', // the database server
    port: 5432, // the database port
    database: process.env.POSTGRES_DB, // the database name
    user: process.env.POSTGRES_USER, // the user account to connect with
    password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // you can view this message in the docker compose logs
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.static(__dirname + '/'));

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

app.get('/aiResponse', async (req, res) => {
    try {
        const fen = req.body.fen;
        
        const data = await postChessApi({ fen });
        
        res.json(data);
    } catch (error) {
        console.error("Error:", error);
    }
});

async function postChessApi(data = {}) {
    try {
        const response = await fetch("https://chess-api.com/v1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
        return response.json();
    } catch (error) {
        throw new Error("error");
    }
}

// The default route, used for testing
app.get('/welcome', (req, res) => {
    res.json({ status: 'success', message: 'Welcome!' });
});

// The default route, redirects to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Render endpoint for the register page
app.get('/register', (req, res) => {
    res.render("pages/register");
});

// Post endpoint for the register page, processes username and password storage
app.post('/register', async (req, res) => {
    // hash the password
    const hash = await bcrypt.hash(req.body.password, 10);
    const username = req.body.username;

    // Check if the username is valid (not too long, no special characters)
    if (!username || username.length > 20 || /[!@#$%^&*()\/<>,.\{\[\}\]\|\\]/.test(username)) {
        return res.status(400).render("pages/register", { error: true, message: "Invalid input" });
    }
    
    const insert_query = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;";
    
    // Insert the user into the database
    db.any(insert_query, [req.body.username, hash])
        .then(function (data) {
            res.status(200).redirect("/login");
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).redirect("/register");
        })
});

// Render endpoint for the login page
app.get('/login', (req, res) => {
    res.render("pages/login");
});

// Post endpoint for the login page, processes username and password verification
app.post('/login', async (req, res) => {
    const find_user = "SELECT * FROM users WHERE username = $1;";

    // Try to find the user
    db.any(find_user, [req.body.username])
        .then(async function (data) {
            var user = data[0];

            // Check if user exists at all before we check the password
            // Redirects to register
            if (!user) {
                return res.status(400).render("pages/register", { error: true, message: "User does not exist." });
            }

            // Check if the password is correct
            const match = await bcrypt.compare(req.body.password, user.password);

            // If the password is incorrect, return an error and redirect to the login page
            if (!match) {
                return res.status(400).render("pages/login", { error: true, message: "Incorrect password"});
            }
            // If the password is correct, set the session user and redirect to the home page
            else {
                req.session.user = user;
                req.session.save();
                res.status(200).redirect("/home");
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).render("pages/register", { error: true, message: "User does not exist.", });
        })
});

// Authentication Middleware.
// This middleware checks if the user is logged in. If not, it redirects to the login page.
const auth = (req, res, next) => {
    if (!req.session.user) {
      // Default to login page.
      return res.redirect('/login');
    }
    next();
};
// Authentication Required
app.use(auth);
  
// Render endpoint for the home page
app.get('/home', (req, res) => {
    res.render('pages/home');
});

// Render endpoint for the playType page
app.get('/playType', (req, res) => {
    res.render('pages/playType');
});

app.get('/game', (req, res) => {
    res.render('pages/game');
});

// Render endpoint for the logout page
// Destroys the session and redirects to the logout page
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('pages/logout');
});



// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests

module.exports = app.listen(3000);
console.log('Server is listening on port 3000');