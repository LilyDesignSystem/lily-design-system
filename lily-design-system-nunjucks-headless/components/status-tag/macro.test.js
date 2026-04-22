import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("statusTag macro", () => {
  it("renders the component", () => {
    const html = render("components/status-tag/macro.njk", `
      {% from "components/status-tag/macro.njk" import statusTag %}
      {{ statusTag({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("status-tag");
  });
});
