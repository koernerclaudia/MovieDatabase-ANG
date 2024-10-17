
import {setupBrowserHooks, getBrowserState} from './utils';

describe('App test', function () {
  jest.setTimeout(10000); // Increase global timeout to 10 seconds

  setupBrowserHooks(); // Assuming this sets up your browser hooks correctly
  
  it('is running', async function () {
    const { page } = getBrowserState();  // Get the browser state
    const element = await page.locator('::-p-text(MovieDataBase-ANG)').wait();  // Wait for the element
    // Add any other assertions or interactions if necessary
  });
});