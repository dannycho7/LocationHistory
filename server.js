require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
let db = mongoose.connect(process.env["MONGO_URI"], { useMongoClient: true });

mongoose.Promise = global.Promise;

var User = require("./models/User");

const scraperMethods = require(".");

app.use(bodyParser.json());

app.post("/", (req, res) => {
	if(req.body["email"] && req.body["password"]) {
		scraperMethods.grabTakeout(req.body["email"], req.body["password"])
		.then(scraperMethods.unzipForLocationJSON(req.body["email"], (data) => {
			User.create({ email: req.body["email"], routes: data });
			res.end(data.slice(0, 50));
		}));
	}
});

app.post("/compute", (req, res) => {
	console.log("Computing...");
	if(req.body["email"]) {
		User.find({ email: req.body["email"] })
		.then(user => {
			if(user.length > 0) {
				let fastRoutes = user[0]["routes"];
				console.log("found", fastRoutes);
				db.collection("locations").find().toArray((err, locations) => {
					console.log("All locations", locations);
				});
			}
		});
	}
});

app.listen(5000, () => console.log("Server listening in on port 5000"));
