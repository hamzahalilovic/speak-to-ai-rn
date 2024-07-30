import { test, expect } from "@playwright/test";
import { generateAnswer } from "../responses.js";

test.describe("Mockup Server Tests", () => {
  const inputStatement = "just testing how this works";

  test('should return the correct response for "just testing how this works" by clicking Send button', async ({
    page,
  }) => {
    // Navigate to the page
    await page.goto("http://localhost:3332/prifina");

    // Fill in the input statement
    await page.fill('[data="input-field"]', inputStatement);

    // Click the "Send" button
    await page.click('[data="send-question"]');

    // Wait for the response and check the result
    const response = await page.waitForSelector('[data="response"]');
    const responseText = await response.innerText();

    // Verify the response
    expect(responseText).toContain(generateAnswer);
  });

  //   test('should return the correct response for "just testing how this works" by pressing Enter', async ({
  //     page,
  //   }) => {
  //     await page.goto("http://localhost:3000");

  //     await page.fill('[data="input-field"]', inputStatement);

  //     // Press Enter
  //     await page.keyboard.press("Enter");

  //     // Wait for the response and check the result
  //     const response = await page.waitForSelector('[data="response"]');
  //     const responseText = await response.innerText();

  //     // Verify the response
  //     expect(responseText).toContain(generateAnswer);
  //   });
});
