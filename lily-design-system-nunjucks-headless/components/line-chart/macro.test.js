import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("lineChart macro", () => {
  it("renders the component", () => {
    const html = render("components/line-chart/macro.njk", `
      {% from "components/line-chart/macro.njk" import lineChart %}
      {{ lineChart({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("line-chart");
  });
});
