import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("announcementBanner macro", () => {
  it("renders the component", () => {
    const html = render("components/announcement-banner/macro.njk", `
      {% from "components/announcement-banner/macro.njk" import announcementBanner %}
      {{ announcementBanner({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("announcement-banner");
  });
});
