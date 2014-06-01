module.exports.demo = function(browser) {
	browser.url("http://localhost:8080/")
    .waitForElementVisible("#email", 2000)
		.setValue('#email', 'stephan@moinz.de')
		.setValue('#password', 'stephan')
		.click('#login')
		.waitForElementVisible('#topics', 2000)
    .end()
}