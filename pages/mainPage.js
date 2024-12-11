const { chromium, } = require("@playwright/test");
const fs = require('fs');
const path = require('path');
const loginPage = require('./loginPage');


class MainPage {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.login = null;
    }
    
    async initialize() {

        const storageStateFilePath = 'storageState.json';
        const isStorageStateFileExists = fs.existsSync(storageStateFilePath);

        this.browser = await chromium.launchPersistentContext('',{
            headless: false, 
            ignoreHTTPSErrors: true,
            channel: 'chrome',
            recordVideo: { 
                dir: 'myVideos/',
                fullPage: true,
                width: 1920,
                height: 1080,
                codec: 'vp9',
                quality: 'highest'
            },

            storageState: isStorageStateFileExists ? storageStateFilePath : undefined // Load storage state if file exists

        });

        // this.context = await this.browser.pages();
        this.context = this.browser; // This is now the BrowserContex
        // this.page = await this.context[0];
        this.page = await this.context.pages()[0]; // Get the first page

        // if (fs.existsSync('storageState.json')) {
        //     await this.page.context().addCookies(JSON.parse(fs.readFileSync('storageState.json')));
        // }

        // await this.loadSession();

        this.loginToApp = new loginPage(this.page);
       
        this.testVideoFile = await this.page.video().path(); // Get the path to the current video
    }
    
    async renameVideo(testName) {
        if (this.testVideoFile) {
            const videoDir = 'myVideos/';
            
            // Get current timestamp and convert it to human-readable format
            const timestamp = new Date();
    
            // Manually format the date and time
            const year = timestamp.getFullYear();
            const month = String(timestamp.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const day = String(timestamp.getDate()).padStart(2, '0');
            const hours = String(timestamp.getHours()).padStart(2, '0');
            const minutes = String(timestamp.getMinutes()).padStart(2, '0');
            const seconds = String(timestamp.getSeconds()).padStart(2, '0');
    
            // Format the timestamp as YYYY-MM-DD_HHMMSS
            const readableTimestamp = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
    
            // Use test name and formatted timestamp for the filename
            const newFileName = `${testName}-${readableTimestamp}.webm`;
            const newFilePath = path.join(videoDir, newFileName);
    
            fs.rename(this.testVideoFile, newFilePath, (err) => {
                if (err) {
                    console.error('Error renaming video file:', err);
                } else {
                    console.log(`Video saved as ${newFileName}`);
                }
            });
        }
    }

    async attachVideoToAllure(videoFilePath, testName) {
        if (fs.existsSync(videoFilePath)) {
            const fileName = `${testName}.webm`;
            const attachmentPath = path.join('my-allure-results', 'attachments', fileName);
    
            const attachmentDir = path.dirname(attachmentPath);
            if (!fs.existsSync(attachmentDir)) {
                fs.mkdirSync(attachmentDir, { recursive: true });
            }
    
            fs.copyFileSync(videoFilePath, attachmentPath);
            console.log(`Video attached: ${attachmentPath}`);
        } else {
            console.warn(`Video file not found: ${videoFilePath}`);
        }
    }

    async captureTokens() {
    
        const [response] = await Promise.all([
            this.page.waitForResponse((response) => 
                response.url().includes('/auth/userLogin') && response.status() === 200 // Correct endpoint
            ),
            // this.page.click('//button[normalize-space()="Login Account"]') // Adjust the selector for your login button
        ]);

        const cookies = await this.page.context().cookies();
        
        console.log('Cookies after login:', cookies);
    
        const accessTokenCookie = cookies.find(cookie => cookie.name === 'accessToken');
        const refreshTokenCookie = cookies.find(cookie => cookie.name === 'refreshToken');
    
        if (accessTokenCookie && refreshTokenCookie) {
            const accessTokenValue = accessTokenCookie.value;
            const refreshTokenValue = refreshTokenCookie.value;
            cookies
            // const accessToken = accessTokenCookie;
            // const refreshToken = refreshTokenCookie;
    
            // Save tokens to a file
            fs.writeFileSync('tokens.json', JSON.stringify({ accessTokenValue, refreshTokenValue, cookies }));
            console.log('Tokens captured:', { accessTokenValue, refreshTokenValue, cookies});
    
            await this.setTokens({ accessTokenValue, refreshTokenValue, cookies });
        } else {
            console.log('Access or Refresh Token not found in cookies.');
        }
    }
    
    // async setTokens({ accessTokenValue, refreshTokenValue }) {
    //     await this.page.evaluate((token) => {
    //         localStorage.setItem('accessTokenValue', token.accessTokenValue);
    //         localStorage.setItem('refreshTokenValue', token.refreshTokenValue);
    //     }, { accessTokenValue, refreshTokenValue });
    // }

    // async setTokens({ accessTokenValue, refreshTokenValue }) {
    //     await this.page.context().addCookies([
    //         { name: 'accessTokenValue', value: accessTokenValue, url: this.page.url() },
    //         { name: 'refreshTokenValue', value: refreshTokenValue, url: this.page.url() }
    //     ]);
    // }

    async setTokens({ accessTokenValue, refreshTokenValue }) {
        // Ensure the page has a valid URL
        // if (!this.page.url() || this.page.url() === 'about:blank') {
        //     await this.page.goto('https://sbmuat.timepayonline.com:31749/#/login'); // Replace with the correct URL of your page
        // }
    
        await this.page.context().addCookies([
            { name: 'accessToken', value: accessTokenValue, url: this.page.url() },
            { name: 'refreshToken', value: refreshTokenValue, url: this.page.url() }
        ]);
    }
    
    async loadSession() {
        if (fs.existsSync('tokens.json')) {
            const sessionData = JSON.parse(fs.readFileSync('tokens.json'));
    
            if (sessionData.cookies && Array.isArray(sessionData.cookies)) {
                await this.page.context().addCookies(sessionData.cookies);
                console.log('Cookies loaded from tokens.json');
            } else {
                console.log('No valid cookies found in tokens.json');
            }
    
            await this.setTokens(sessionData);
            console.log('Session loaded from tokens.json');
        } else {
            console.log('No session file found. Proceeding with login.');
        }
    }

    async saveSession() {
        await this.context.storageState({ path: 'storageState.json' }); // Save storage state
    }

    async closeBrowser() {
        await this.browser.close();
    }
}

module.exports = MainPage;
