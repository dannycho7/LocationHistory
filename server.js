const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const scraperMethods = require(".");

app.use(bodyParser.json());

app.post("*", (req, res) => {
	if(req.body["email"] && req.body["password"]) {
		scraperMethods.grabTakeout(req.body["email"], req.body["password"])
		.then(scraperMethods.unzipForLocationJSON(res.end));
	}
});

app.listen(5000, () => console.log("Server listening in on port 5000"));
