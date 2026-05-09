import { describe, expect, it } from "vitest";

describe("Supabase project secrets", () => {
  it("can reach the Supabase REST endpoint with the configured credentials", async () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    expect(url, "SUPABASE_URL should be configured").toBeTruthy();
    expect(key, "SUPABASE_KEY should be configured").toBeTruthy();

    const response = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: key!,
        Authorization: `Bearer ${key!}`,
      },
    });

    expect([200, 404]).toContain(response.status);
  }, 15000);
});
