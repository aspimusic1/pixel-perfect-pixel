import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(currentDir, "GetBookedPlatform.tsx"), "utf8");
const mockInvalidate = vi.fn();
const mockMutate = vi.fn();
(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("@/const", () => ({
  getLoginUrl: () => "/auth",
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ invalidate: mockInvalidate }),
    waitlist: {
      join: {
        useMutation: () => ({
          mutate: mockMutate,
          isPending: false,
        }),
      },
    },
  },
}));

vi.mock("wouter", () => ({
  Link: ({ href, className, onClick, children }: { href: string; className?: string; onClick?: () => void; children: React.ReactNode }) =>
    React.createElement("a", { href, className, onClick }, children),
  useLocation: () => ["/", vi.fn()],
}));

import { LandingPage } from "./GetBookedPlatform";

describe("GetBookedPlatform landing page regression", () => {
  it("renders the public header, hero actions, and Promoter navigation path", () => {
    const markup = renderToStaticMarkup(React.createElement(LandingPage));

    expect(markup).toContain("GETBOOKED.LIVE");
    expect(markup).toContain("Browse");
    expect(markup).toContain("Promoters");
    expect(markup).toContain('href="/browse/promoters"');
    expect(markup).toContain("Enter the platform");
    expect(markup).toContain("Explore the directory");
    expect(markup).toContain("Join the waitlist");
  });

  it("does not wrap route links around nested anchor tags in source", () => {
    expect(source).not.toMatch(/<Link[^>]*>\s*<a\b/);
  });
});
