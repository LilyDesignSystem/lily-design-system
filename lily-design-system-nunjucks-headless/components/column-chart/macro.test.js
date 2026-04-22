import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("columnChart macro", () => {
  it("renders the component", () => {
    const html = render("components/column-chart/macro.njk", `
      {% from "components/column-chart/macro.njk" import columnChart %}
      {{ columnChart({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("column-chart");
  });
});
