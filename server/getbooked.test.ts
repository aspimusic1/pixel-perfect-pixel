import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { refreshBookScores } from "./getbooked";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 7,
    openId: "user-getbooked",
    email: "builder@getbooked.live",
    name: "GetBooked Builder",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => undefined,
    } as TrpcContext["res"],
  };
}

describe("GetBooked platform router", () => {
  it("stores the selected role and returns the correct app redirect", async () => {
    const caller = appRouter.createCaller(createContext());

    const result = await caller.onboarding.setRole({ role: "promoter" });
    const viewer = await caller.platform.viewer();

    expect(result.redirectTo).toBe("/app/promoter");
    expect(viewer.role).toBe("promoter");
    expect(viewer.onboardingComplete).toBe(true);
  });

  it("creates an offer and allows the recipient to accept it", async () => {
    const caller = appRouter.createCaller(createContext());

    const created = await caller.offers.create({
      artistName: "Midnight Sonar",
      eventName: "Neon Nights Festival",
      eventDate: "2026-07-19",
      venueName: "Lantern Hall",
      city: "Nashville",
      feeLabel: "$6,000 guarantee",
      depositLabel: "$1,500 deposit",
      dealType: "Flat fee",
    });

    expect(created.status).toBe("sent");

    const updated = await caller.offers.respond({
      id: created.id,
      status: "accepted",
    });

    expect(updated?.status).toBe("accepted");

    const deal = await caller.deals.get({ id: created.id });
    expect(deal.title).toContain("Neon Nights Festival");
  });

  it("returns browse results for a role-filtered directory query", async () => {
    const publicCaller = appRouter.createCaller({
      user: null,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    const result = await publicCaller.browse.list({ role: "artist", city: "Los Angeles" });

    expect(result.role).toBe("artist");
    expect(result.profiles.length).toBeGreaterThan(0);
    expect(result.profiles.every(profile => profile.role === "artist")).toBe(true);
  });
});

describe("GetBooked BookScore refresh", () => {
  it("builds a deterministic snapshot for artist scores", async () => {
    const result = await refreshBookScores();

    expect(result.updatedArtists).toBeGreaterThan(0);
    expect(result.snapshot.every(item => item.total >= 0 && item.total <= 100)).toBe(true);
  });
});
