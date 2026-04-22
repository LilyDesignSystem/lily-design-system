import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("sectionListItem macro", () => {
  it("renders the component", () => {
    const html = render("components/section-list-item/macro.njk", `
      {% from "components/section-list-item/macro.njk" import sectionListItem %}
      {{ sectionListItem({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("section-list-item");
  });
});
