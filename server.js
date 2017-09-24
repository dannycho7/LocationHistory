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
		.then(() => scraperMethods.unzipForLocationJSON(req.body["email"], (data) => {
			User.create({ email: req.body["email"], routes: data });
			db.collection("locations").find({ email: req.body["email"] }).limit(50).toArray((err, locations) => {
				res.end(JSON.stringify(locations));
			});
		}));
	}
});

function computeInconvenience(currentUserFastRoute, destination) {
	return Math.abs(currentUserFastRoute[0] - destination[0]) + Math.abs(currentUserFastRoute[1] - destination[1]);
}

const marginOfError = 0.5;

app.post("/compute", (req, res) => {
	console.log("Computing...");
	if(req.body["email"]) {
		User.find({ email: req.body["email"] })
		.then(user => {
			if(user.length > 0) {
				let currentUserFastRoutes = user[0]["routes"];
				console.log("found", currentUserFastRoutes);
				db.collection("users").find({ "email": { $ne: req.body["email"] } }).toArray((err, users) => {
					let roughInconvenience = {};
					users.forEach(user => {
						user["routes"].forEach(destination => {
							currentUserFastRoutes.forEach(currentUserFastRoute => {
								let inconvenience = computeInconvenience(currentUserFastRoute, destination);
								console.log(`Inconvenience is ${inconvenience} for ${currentUserFastRoute} and ${destination}`)
								if(inconvenience < marginOfError) {
									roughInconvenience[inconvenience1] = destination;
								}
							});
						});
						
					});
					let leastInconvenient = Object.keys(roughInconvenience).sort().map((resultPlot) => {
						return roughInconvenience[resultPlot];
					});
					console.log(leastInconvenient);
					res.end(JSON.stringify(leastInconvenient));
				});
			}
		});
	}
});

app.listen(5000, () => console.log("Server listening in on port 5000"));
