import { test, expect } from "@playwright/test";
import fetch from "node-fetch";
import { detect } from "../responses.js";

test.describe("Mockup Server Tests", () => {
  // test.beforeAll(async () => {
  //   await import("../server.js");
  // });

  //should run server before running test

  test('should return the correct response for "testing how this works"', async () => {
    const inputStatement = "testing how this works";

    // Send the request to the mock server
    const response = await fetch("http://localhost:3000/api/v1/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: inputStatement }),
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data.response.AI.answer).toBe(detect.response.AI.answer);
  });
});
