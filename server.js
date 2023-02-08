const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
	origin: "*"
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });


// Routes pour les pages Login et Register
app.get("/login", (req, res) => {
	res.sendFile(__dirname +'/public/login.html');
});
app.get("/register", (req, res) => {
	res.sendFile(__dirname +'/public/register.html');
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/message.routes')(app);
require('./app/routes/channel.routes')(app);
require('./app/routes/pm.routes')(app);


// Méthodes permettant la redirection de n'importe quel URL vers le fichier HTML principal
app.use(express.static(__dirname + '/public'));
app.get("*", (req, res) => {
	res.sendFile(__dirname +'/public/index.html');
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
