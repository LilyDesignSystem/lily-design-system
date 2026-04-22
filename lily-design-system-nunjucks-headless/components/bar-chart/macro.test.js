import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("barChart macro", () => {
  it("renders the component", () => {
    const html = render("components/bar-chart/macro.njk", `
      {% from "components/bar-chart/macro.njk" import barChart %}
      {{ barChart({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("bar-chart");
  });
});
