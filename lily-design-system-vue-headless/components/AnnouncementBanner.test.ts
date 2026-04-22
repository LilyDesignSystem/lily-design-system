import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import AnnouncementBanner from "./AnnouncementBanner.vue";

describe("AnnouncementBanner", () => {
  it("renders with class", () => {
    const { container } = render(AnnouncementBanner, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".announcement-banner");
    expect(el).toBeTruthy();
  });
});
