import { describe, expect, it } from "vitest";

const RESEND_API_URL = "https://api.resend.com/domains";

describe("resend credentials", () => {
  it("validate the API key and sender address against the Resend API", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    expect(apiKey, "RESEND_API_KEY must be configured").toBeTruthy();
    expect(fromEmail, "RESEND_FROM_EMAIL must be configured").toBeTruthy();
    expect(fromEmail).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);

    const response = await fetch(RESEND_API_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    expect(response.ok, `Resend API request failed with status ${response.status}`).toBe(true);

    const payload = (await response.json()) as {
      data?: Array<{ name?: string; status?: string }>;
      error?: { message?: string };
    };

    expect(Array.isArray(payload.data), payload.error?.message ?? "Expected Resend domains response").toBe(true);

    const senderDomain = fromEmail!.split("@")[1];
    const matchingDomain = payload.data?.find(entry => entry.name === senderDomain);

    expect(matchingDomain, `Expected verified Resend domain for ${senderDomain}`).toBeTruthy();
    expect(["verified", "temporary", "not_started", "pending"].includes(matchingDomain?.status ?? "")).toBe(true);
  });
});
