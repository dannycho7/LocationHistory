require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
mongoose.connect(process.env["MONGO_URI"], { useMongoClient: true, promiseLibrary: global.Promise });

var User = require("./models/User");

const scraperMethods = require(".");

app.use(bodyParser.json());

app.post("/", (req, res) => {
	if(req.body["email"] && req.body["password"]) {
		scraperMethods.grabTakeout(req.body["email"], req.body["password"])
		.then(scraperMethods.unzipForLocationJSON(req.body["email"], (data) => {
			User.create({ email: req.body["email"], routes: data });
			res.end(data);
		}));
	}
});

app.post("/compute", (req, res) => {
	// something else
});

app.listen(5000, () => console.log("Server listening in on port 5000"));
