import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("successPanel macro", () => {
  it("renders the component", () => {
    const html = render("components/success-panel/macro.njk", `
      {% from "components/success-panel/macro.njk" import successPanel %}
      {{ successPanel({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("success-panel");
  });
});
