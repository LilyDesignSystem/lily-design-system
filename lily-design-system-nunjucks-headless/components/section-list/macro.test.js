import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("sectionList macro", () => {
  it("renders the component", () => {
    const html = render("components/section-list/macro.njk", `
      {% from "components/section-list/macro.njk" import sectionList %}
      {{ sectionList({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("section-list");
  });
});
