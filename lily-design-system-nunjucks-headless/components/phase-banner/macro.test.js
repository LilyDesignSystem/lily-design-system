import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("phaseBanner macro", () => {
  it("renders the component", () => {
    const html = render("components/phase-banner/macro.njk", `
      {% from "components/phase-banner/macro.njk" import phaseBanner %}
      {{ phaseBanner({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("phase-banner");
  });
});
