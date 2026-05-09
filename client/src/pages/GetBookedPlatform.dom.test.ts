import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(currentDir, "GetBookedPlatform.tsx"), "utf8");

describe("GetBookedPlatform link composition", () => {
  it("does not wrap wouter Link components around nested anchor tags", () => {
    expect(source).not.toMatch(/<Link[^>]*>\s*<a\b/);
  });

  it("includes the Promoter browse path in public navigation and directory tabs", () => {
    expect(source).toContain('/browse/promoters');
    expect(source).toContain('Promoters');
  });
});
