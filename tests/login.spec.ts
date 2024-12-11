import { test, expect } from '@playwright/test';
const MainPage = require("../pages/mainPage.js")
const { getTestData } = require('../utils/readExcelUtils.js');
const fs = require('fs').promises; // Use promises for filesystem operation
const excelDataProvider = getTestData('login-data-provider.xlsx', 'Sheet1');

test.describe.serial('Login Functionality', () => {
    let mainPage;

  test.beforeAll(async () => {
        mainPage = new MainPage();
        await mainPage.initialize();    
  });

  test.afterAll(async () => {
      await mainPage.renameVideo('Login');
      await mainPage.closeBrowser();
  });

    test('Login - Verify that password visibility is in asterisk format by default @regression', async () => {
        const data = excelDataProvider[5];  
        console.log(data, "valid data");

        await mainPage.loginToApp.gotoLoginPage();

        const register_password = String(data['Password']);

        await mainPage.loginToApp.fillPass(register_password);
        const defaultAsterisk = await mainPage.loginToApp.asteriskPassword();

        expect(defaultAsterisk).toBe('password'); 
    });

    test('Login - Verify password visibility toggle on eye icon click @regression', async () => {
        const data = excelDataProvider[5];
        console.log(data, "valid data");

        const register_password = String(data['Password']);

        await mainPage.loginToApp.fillPass(register_password);
        await mainPage.loginToApp.toggleViewPassword();

        console.log("Password visibility toggle is working, password displayed in readable format.");
    });

    test("Invalid Login - Login with empty Password field @sanity",async () => {
        const data = excelDataProvider[2];
        await mainPage.loginToApp.gotoLoginPage();
        console.log(data, "diejdiedji");

        const username = String(data['Username ']);
        const password = ""; 
        const validationMsg = String(data['Validation messages']);

        await mainPage.loginToApp.login(username, password);
        await mainPage.loginToApp.verifyLoginFailure(validationMsg);        
    });

    test("Invalid Login - Login with alphabetic and symbolic characters in mobile number @sanity", async () => {
        const data = excelDataProvider[3];
        // await mainPage.loginToApp.gotoLoginPage();

        const username = String(data['Username ']);
        const password = data.Password;
        const validationMsg = String(data['Validation messages']);

        await mainPage.loginToApp.login(username, password);
        await mainPage.loginToApp.verifyValidationMessage(validationMsg);
    });

    test("Invalid Login - Login with invalid credentials @sanity @regression ", async () => {
        const data = excelDataProvider[4];
        console.log(data, "show the invalid credentials");
        
        // const username = String(data['Username']);
        const username = data['Username '] ? String(data['Username ']) : '';

        const password = data.Password;
        const popupMsg = String(data['Pop-up messages']);
        await mainPage.loginToApp.login(username, password);

        const errorMessage = await mainPage.loginToApp.validatePopUpMsg(popupMsg);
        expect(errorMessage).toContain(popupMsg); 
    });

    test("Links - Verify all links on the Login Page are clickable @sanity", async () => {    
        await mainPage.loginToApp.gotoLoginPage();
        await mainPage.loginToApp.clickForgotPasswordLink();
        await mainPage.loginToApp.clickTermsAndConditionsLink();
        await mainPage.loginToApp.clickPrivacyPolicyLink();
    });

    test("Valid Login - Login with valid credentials @sanity", async() => {
        const data = excelDataProvider[0];  
        // await mainPage.loginToApp.gotoLoginPage();

        const username = String(data['Username ']);
        const password = data.Password;

        await mainPage.loginToApp.portalLogin(username, password);
        await mainPage.loginToApp.verifyUserDashboard();
        await mainPage.saveSession();

    });

});
