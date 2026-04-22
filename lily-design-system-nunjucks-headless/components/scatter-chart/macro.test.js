import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("scatterChart macro", () => {
  it("renders the component", () => {
    const html = render("components/scatter-chart/macro.njk", `
      {% from "components/scatter-chart/macro.njk" import scatterChart %}
      {{ scatterChart({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("scatter-chart");
  });
});
