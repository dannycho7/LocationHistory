const fs = require("fs");
const path = require("path");
const unzip = require("unzip2");
const webdriver = require('selenium-webdriver');
const { By, until } = webdriver;
const chrome = require('selenium-webdriver/chrome');

async function grabTakeout() {
	const service = new chrome.ServiceBuilder(require('chromedriver').path).build();
	chrome.setDefaultService(service);

	var options = new chrome.Options();
	let downloadPath = __dirname + "/output";
	options.setUserPreferences({ "download.default_directory": downloadPath });

	var driver = new webdriver.Builder()
					.forBrowser("chrome")
				    .withCapabilities(options.toCapabilities())
				    .build();

	driver.get("https://google.com");

	driver.findElement(By.id("gb_70")).click()
	driver.findElement(By.name("identifier")).sendKeys("doomofn00b11@gmail.com");
	driver.findElement(By.id("identifierNext")).click();
	/*driver.sleep(500);
	driver.findElement(By.name("password")).sendKeys("");
	driver.findElement(By.id("passwordNext")).click();
	*/
	await driver.wait(until.elementLocated(By.name("q")))
	driver.get("https://takeout.google.com/settings/takeout/custom/location_history?expflags&gl=US&hl=en");
	driver.findElement(By.xpath("//*[text() = 'Next']")).click();
	driver.sleep(1000);
	await driver.wait(until.elementLocated(By.xpath("//*[text() = 'Next']")))
	driver.findElement(By.xpath("//*[text() = 'Create archive']")).click();

	let downloadBtn = await driver.wait(until.elementLocated(By.css(".do.am div[jscontroller='vHpMNe']")))
	driver.sleep(100);
	downloadBtn.click();

	driver.sleep(500);

	while(fs.readdirSync(__dirname + "/output").reduce((accum, file) => accum || file.includes(".crdownload"), false)) {
		await new Promise((resolve, reject) => {
			setTimeout(() => resolve(), 1000);
		});
	};

	driver.quit();
}

async function unzipForLocationJSON() {
	console.log("unzipping...");
	fs.readdirSync(__dirname + "/output").forEach((filename) => {
		fs.createReadStream(__dirname + "/output" + `/${filename}`)
		.pipe(unzip.Parse())
		.on("entry", (entry) => {
			var fileName = entry.path;
		    var type = entry.type; // 'Directory' or 'File' 
		    var size = entry.size;
		    if (path.basename(entry.path) === "Location History.json") {
				console.log("found");
		    } else {
				entry.autodrain();
		    }
		});
	});
}

async function cleanOutput() {
	// does nothing for now
}

grabTakeout()
.then(unzipForLocationJSON)
.then(cleanOutput);
