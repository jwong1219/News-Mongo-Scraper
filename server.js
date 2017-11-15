//require the packages
const express = require("express");
const cliLog = require("morgan");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");

//require the mmongoose models
const db = require("./models");

//set the port the server will be listening on
const PORT = process.env.PORT || 6060;

// initialize express
const app = express();

// set up Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// this will log requests coming into the server
app.use(cliLog("dev"));

// set up static files to serve to the client
app.use(express.static("public"));

// set mongoose to use promises and connect to Mongo
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newsScraper", {
  useMongoClient: true
});

// set up routes to use
// const artRoutes = require("./routes/artRoutes.js");
// const noteRoutes = require("./routes/noteRoutes.js");
const rootRoute = require("./routes/root.js");

// app.use("/articles", artRoutes);
// app.use("/notes", noteRoutes);
app.use("/", rootRoute);

// start the server
app.listen(PORT, function() {
  console.log(`Server running on port ${PORT}...`);
});