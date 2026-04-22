import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AnnouncementBanner from "./AnnouncementBanner";

describe("AnnouncementBanner", () => {
  it("renders with class", () => {
    const { container } = render(<AnnouncementBanner label="Test">content</AnnouncementBanner>);
    const el = container.querySelector(".announcement-banner");
    expect(el).toBeTruthy();
  });
});
