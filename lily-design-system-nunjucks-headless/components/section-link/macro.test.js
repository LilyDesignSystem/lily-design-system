import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("sectionLink macro", () => {
  it("renders the component", () => {
    const html = render("components/section-link/macro.njk", `
      {% from "components/section-link/macro.njk" import sectionLink %}
      {{ sectionLink({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("section-link");
  });
});
