import { describe, it, expect } from "vitest";
import {
  computeDealStatus,
  getDemoDealRoom,
  DEAL_STATUSES,
  DEAL_STATUS_LABELS,
} from "./dealRoom";

const participants = ["artist-1", "promoter-1"];

describe("computeDealStatus", () => {
  it("returns draft when there's nothing to go on", () => {
    expect(
      computeDealStatus({
        booking: null,
        offer: null,
        signatures: [],
        participantIds: participants,
      }),
    ).toBe("draft");
  });

  it("returns sent for a pending offer with no booking yet", () => {
    expect(
      computeDealStatus({
        booking: null,
        offer: { status: "pending" },
        signatures: [],
        participantIds: participants,
      }),
    ).toBe("sent");
  });

  it("returns in_negotiation when a counter is live", () => {
    expect(
      computeDealStatus({
        booking: null,
        offer: { status: "negotiating" },
        signatures: [],
        participantIds: participants,
      }),
    ).toBe("in_negotiation");
  });

  it("returns awaiting_signature when offer accepted but no booking", () => {
    expect(
      computeDealStatus({
        booking: null,
        offer: { status: "accepted" },
        signatures: [],
        participantIds: participants,
      }),
    ).toBe("awaiting_signature");
  });

  it("returns confirmed when booking exists with no contract uploaded", () => {
    expect(
      computeDealStatus({
        booking: { status: "confirmed", contract_url: null },
        offer: { status: "accepted" },
        signatures: [],
        participantIds: participants,
      }),
    ).toBe("confirmed");
  });

  it("returns awaiting_signature when contract uploaded but not fully signed", () => {
    expect(
      computeDealStatus({
        booking: { status: "confirmed", contract_url: "https://…" },
        offer: { status: "accepted" },
        signatures: [{ user_id: "artist-1" }],
        participantIds: participants,
      }),
    ).toBe("awaiting_signature");
  });

  it("returns confirmed when every participant has signed", () => {
    expect(
      computeDealStatus({
        booking: { status: "confirmed", contract_url: "https://…" },
        offer: { status: "accepted" },
        signatures: [{ user_id: "artist-1" }, { user_id: "promoter-1" }],
        participantIds: participants,
      }),
    ).toBe("confirmed");
  });

  it("ignores duplicate signatures from the same user", () => {
    expect(
      computeDealStatus({
        booking: { status: "confirmed", contract_url: "https://…" },
        offer: { status: "accepted" },
        signatures: [
          { user_id: "artist-1" },
          { user_id: "artist-1" },
        ],
        participantIds: participants,
      }),
    ).toBe("awaiting_signature");
  });

  it("returns completed when the booking is completed (even with pending signatures)", () => {
    expect(
      computeDealStatus({
        booking: { status: "completed", contract_url: null },
        offer: { status: "accepted" },
        signatures: [],
        participantIds: participants,
      }),
    ).toBe("completed");
  });

  it("returns cancelled for declined offers", () => {
    expect(
      computeDealStatus({
        booking: null,
        offer: { status: "declined" },
        signatures: [],
        participantIds: participants,
      }),
    ).toBe("cancelled");
  });

  it("returns cancelled for expired offers", () => {
    expect(
      computeDealStatus({
        booking: null,
        offer: { status: "expired" },
        signatures: [],
        participantIds: participants,
      }),
    ).toBe("cancelled");
  });

  it("returns cancelled when the booking is cancelled", () => {
    expect(
      computeDealStatus({
        booking: { status: "cancelled", contract_url: null },
        offer: { status: "accepted" },
        signatures: [
          { user_id: "artist-1" },
          { user_id: "promoter-1" },
        ],
        participantIds: participants,
      }),
    ).toBe("cancelled");
  });
});

describe("status metadata", () => {
  it("has a label for every status", () => {
    for (const s of DEAL_STATUSES) {
      expect(DEAL_STATUS_LABELS[s]).toBeTruthy();
    }
  });
});

describe("getDemoDealRoom", () => {
  it("produces a coherent demo booking that resolves to awaiting_signature", () => {
    const demo = getDemoDealRoom();
    expect(demo.booking.venue_name).toBeTruthy();
    expect(demo.participants).toHaveLength(2);
    expect(demo.messages.length).toBeGreaterThan(0);

    const status = computeDealStatus({
      booking: demo.booking,
      offer: demo.offer,
      signatures: demo.signatures,
      participantIds: demo.participants.map((p) => p.user_id),
    });
    // Demo has the promoter signed, but the artist hasn't — so we're waiting
    // on the second signature.
    expect(status).toBe("awaiting_signature");
  });
});
