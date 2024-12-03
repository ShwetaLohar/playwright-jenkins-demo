const { expect, chromium} = require("@playwright/test");
const { TIMEOUT } = require("dns");

class demo {
    constructor(page) {
        this.page = page;
        this.navigateUrl = 'https://playwright.dev/';
}

async navigatetoDemo(){
    await page.goto(this.navigateUrl);
}

}

module.exports = demo;
