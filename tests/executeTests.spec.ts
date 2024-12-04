import { test } from '@playwright/test';

const specFiles = [
//   './registration.spec.ts',
  './login.spec.ts',
//   './onboardingForms.spec.ts',
//   './checkerMerchant.spec.ts',
//   './submerchantUpload.spec.ts',
//   './checkerSubmerchant.spec.ts',
//   './merchantActivation.spec.ts',
//   './submerchantActivation.spec.ts',
];

// Read tags from the environment variable or use an empty string if none is provided
// const tags = process.env.TAGS || '';

// // Define a regular expression to match the tags (like @smoke or @regression)
// const grepRegex = new RegExp(tags.split(',').map(tag => `@${tag}`).join('|'), 'i');

for (const specFile of specFiles) {
  test.describe(`Running tests from ${specFile}`, () => {

    test.beforeAll(async () => {
      
    });

    test.afterAll(async () => {

    });

    require(specFile);
  });
}
