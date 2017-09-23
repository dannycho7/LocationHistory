var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var chrome = require('selenium-webdriver/chrome');

var path = require('chromedriver').path;

var service = new chrome.ServiceBuilder(path).build();
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
driver.findElement(By.name("identifier")).sendKeys("dannycho91@gmail.com");
driver.findElement(By.id("identifierNext")).click();
/*driver.sleep(500);
driver.findElement(By.name("password")).sendKeys("");
driver.findElement(By.id("passwordNext")).click();
*/
driver.wait(until.elementLocated(By.name("q")))
.then(element => {
	driver.get("https://takeout.google.com/settings/takeout/custom/location_history?expflags&gl=US&hl=en");
	driver.findElement(By.xpath("//*[text() = 'Next']")).click();
	driver.sleep(1000);
	driver.wait(until.elementLocated(By.xpath("//*[text() = 'Next']")))
	.then(element => {
		driver.findElement(By.xpath("//*[text() = 'Create archive']")).click();

		driver.wait(until.elementLocated(By.css(".do.am div[jscontroller='vHpMNe']")))
		.then(element => {
			driver.sleep(100);
			element.click();
			driver.sleep(10000);
			driver.quit();
		});
	});
});
