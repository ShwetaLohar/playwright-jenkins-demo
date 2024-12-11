const { expect, chromium} = require("@playwright/test");
const { TIMEOUT } = require("dns");

class loginPage {
    constructor(page) {
        this.page = page;
        this.usernameField = '//input[@id="input-mail"]';
        this.passwordField = '(//input[@id="inputPass"])[1]';
        this.loginButton = '//button[normalize-space()="Login Account"]';
        // this.errorMessageLocator = '#cdk-overlay-0 div';
        this.errorMessageLocator = '//div[contains(@class, "ant-notification-notice")]';
        this.successMessageLocator = '#cdk-overlay-0 div';
        this.popUpMessageLocator = '#cdk-overlay-1 div';

        this.forgotPasswordLink = this.page.getByRole('link', { name: 'click here' });
        this.termsAndConditionsLink = this.page.getByRole('link', { name: 'Terms & Conditions' });
        this.privacyPolicyLink = this.page.getByRole('link', { name: 'Privacy Policy' });

        this.genericButton = this.page.getByRole('button', { name: 'Generic' });
        this.termsCheckBox = this.page.getByLabel('I/We have read the terms and');
        this.acceptTermsButton = this.page.getByRole('button', { name: 'ACCEPT' });
        this.privacyCheckBox = this.page.getByLabel('I/We have read the privacy');
        this.privacyAcceptText = this.page.getByText('I/We have read the privacy policy and acknowledge the same ACCEPT');
        this.dashboardSelector = "https://sbmuat.timepayonline.com:31749/#/user/api/dashboard";
        // this.errorMessages = [
        //     'Login ErrorEnter valid credentials',
        //     'Login ErrorError: Failed to fetch merchant details',
        // ];

        this.errorMessageSelectors = [
            { text: 'Login ErrorInvalid', locator: '#cdk-overlay-1 div' },
            { text: 'Login ErrorError: Failed to', locator: '#cdk-overlay-1 div' },
        ];
    }

   
    async fillMobile(value){
        await this.page.fill(this.usernameField, value);
    }

    async fillPass(value){
        await this.page.fill(this.passwordField, value);
    }

    async toggleViewPassword(){
        const passwordField = this.page.locator(this.passwordField); // replace '#password' with the actual selector
        const initialType = await passwordField.getAttribute('type');
        expect(initialType).toBe('password');
        
        // Click the eye icon to reveal password
        await this.page.locator('//em[@class="bi bi-eye-slash"]').click(); // replace '.eye-icon' with the actual selector for the eye icon
    
        // Verify the password is displayed in a readable format
        const updatedType = await passwordField.getAttribute('type');
        expect(updatedType).toBe('text'); // 'text' type indicates password is visible
        
        return updatedType;
    }


    async gotoLoginPage() {      

        await this.page.context().clearCookies();
        // await this.page.context().clearCache();

        for (let attempt = 0; attempt < 3; attempt++) {
            try {

                await this.page.goto('https://sbmuat.timepayonline.com:31749/login');
                await this.page.waitForLoadState('domcontentloaded');
                await this.page.waitForTimeout(2000);
                console.log('Navigation successful');
                break;
            } catch (error) {
                console.log(`Attempt ${attempt + 1} failed:`, error);
                if (attempt === 2) throw error;  
            }
        }
    }
 
    async login(username, password) {
    
        if (username) {
            await this.page.click(this.usernameField);
            await this.page.fill(this.usernameField, username);
        }
        
        if (password) {
            await this.page.fill(this.passwordField, password);
        }

    
        await Promise.all([
            this.page.waitForTimeout(2000),
            this.page.dblclick(this.loginButton)
        ]);
    }   

    async checkForErrorMessages() {        
        for (const { text, locator } of this.errorMessageSelectors) {
            const errorLocator = this.page.locator(locator).filter({ hasText: text }).nth(1);
            if (await errorLocator.isVisible()) {
                console.log(`Error displayed: ${text}`);
                await errorLocator.click(); 
                return true; 
            }
        }
        return false; 
    }

    async portalLogin(username, password) {
        if (username) {
            await this.page.fill(this.usernameField, username);
        }
    
        if (password) {
            await this.page.fill(this.passwordField, password);
        }
    
        await this.page.click(this.loginButton);
    
        try {
           
            await this.page.waitForURL('https://sbmuat.timepayonline.com:31749/#/user/api/dashboard', { timeout: 5000 });
            console.log('Redirected to dashboard on the first attempt.');
        } catch (error) {
            const isError = await this.checkForErrorMessages();
            if (isError) {
                console.log('Error message displayed, attempting second click.');
                await this.page.click(this.loginButton);
                await this.page.waitForURL('https://sbmuat.timepayonline.com:31749/#/user/api/dashboard', { timeout: 5000 });
                console.log('Redirected to dashboard on the second attempt.');
            } else {
                console.error('Login failed after first attempt.');
            }
        }
    }

    // async portalLogin(username, password) {
    //     if (username) {
    //         await this.page.fill(this.usernameField, username);
    //     }
    
    //     if (password) {
    //         await this.page.fill(this.passwordField, password);
    //     }
    
    //     const maxAttempts = 3; // Maximum number of attempts
    //     let attempt = 0;
    
    //     while (attempt < maxAttempts) {
    //         attempt++;
    //         console.log(`Attempt ${attempt}: Clicking login button.`);
    //         await this.page.click(this.loginButton);
    
    //         try {
    //             // Wait for successful redirection to the dashboard
    //             await this.page.waitForURL('https://sbmuat.timepayonline.com:31749/#/user/api/dashboard', { timeout: 5000 });
    //             console.log(`Redirected to dashboard on attempt ${attempt}.`);
    //             return; // Exit the function if successful
    //         } catch (error) {
    //             // Check if the error message is displayed
    //             const isError = await this.checkForErrorMessages();
    //             if (isError) {
    //                 console.log(`Error message displayed on attempt ${attempt}. Retrying...`);
    //                 continue; // Retry the login
    //             } else {
    //                 console.error(`Unexpected error occurred on attempt ${attempt}: ${error.message}`);
    //                 break; // Exit loop for unexpected errors
    //             }
    //         }
    //     }
    
    //     console.error('Failed to login after maximum attempts.');
    // }
    
    async verifyLoginSuccess() {
        const successMessage = await this.page.locator(this.successMessageLocator).filter({ hasText: 'Login Successful...Welcome' }).nth(1);
        await expect(successMessage).toBeVisible();
    }

    async verifyLoginFailure(expectedMessage) {
        const errorMessage = await this.page.locator(this.errorMessageLocator).filter({ hasText: expectedMessage }).nth(1);
        await expect(errorMessage).toBeVisible();
    }

    async verifyValidationMessage() {
        const validationMessage = await this.page.getByText('Please enter a valid number');
        await expect(validationMessage).toBeVisible();
    }

    async validatePopUpMsg(){
        const errorMessageLocator = await this.page.getByText('Login ErrorUser Not Found!');
        await expect(errorMessageLocator).toBeVisible();

        const errorMessage = await errorMessageLocator.textContent();
        console.log("show user existence", errorMessage);
        return errorMessage;
    }

    async clickForgotPasswordLink() {
        await this.forgotPasswordLink.click();
        await expect(this.page).toHaveURL('https://sbmuat.timepayonline.com:31749/#/forgot-pass');
        await this.page.goBack();
    }

    async clickTermsAndConditionsLink() {
        await this.termsAndConditionsLink.click();
        await expect(this.page).toHaveURL('https://sbmuat.timepayonline.com:31749/#/term-condition');
        await this.page.goBack();
    }

    async clickPrivacyPolicyLink() {
        await this.privacyPolicyLink.click();
        await expect(this.page).toHaveURL('https://sbmuat.timepayonline.com:31749/#/privacy-policy');
        await this.page.goBack();
    }

    async verifyUserDashboard(){
        await expect(this.page).toHaveURL('https://sbmuat.timepayonline.com:31749/#/user/api/dashboard');
    }

    async acceptTermsAndConditions() {
        await this.genericButton.click();

        await this.termsCheckBox.check();
        await expect(this.page.locator('h2')).toContainText('Terms and Conditions');

        await this.acceptTermsButton.click();
        await this.privacyCheckBox.check();

        await expect(this.page.locator('h2', { hasText: 'A. Privacy Policy' })).toContainText('A. Privacy Policy');
        await this.privacyAcceptText.click();
    }

    async asteriskPassword(){
        const passwordField = this.page.locator(this.passwordField); // replace '#password' with the actual selector
        const inputType = await passwordField.getAttribute('type');
        return inputType;
    }

    async logout(){
        await this.page.getByRole('button', { name: 'Logout' }).click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
    }
}

module.exports = loginPage;
