import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DealStatusBadge from "./DealStatusBadge";
import { DEAL_STATUSES } from "@/lib/dealRoom";

describe("DealStatusBadge", () => {
  it("renders a badge for every known status", () => {
    for (const status of DEAL_STATUSES) {
      const { unmount } = render(<DealStatusBadge status={status} />);
      const badge = screen.getByTestId("deal-status-badge");
      expect(badge.getAttribute("data-status")).toBe(status);
      expect(badge.textContent?.toLowerCase()).toContain(
        status.replace(/_/g, " "),
      );
      unmount();
    }
  });

  it("accepts an extra className", () => {
    render(<DealStatusBadge status="confirmed" className="custom-cls" />);
    const badge = screen.getByTestId("deal-status-badge");
    expect(badge.className).toContain("custom-cls");
  });
});
