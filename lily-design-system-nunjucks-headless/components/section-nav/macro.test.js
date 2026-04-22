import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("sectionNav macro", () => {
  it("renders the component", () => {
    const html = render("components/section-nav/macro.njk", `
      {% from "components/section-nav/macro.njk" import sectionNav %}
      {{ sectionNav({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("section-nav");
  });
});
