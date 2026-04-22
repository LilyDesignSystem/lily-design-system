import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("areaChart macro", () => {
  it("renders the component", () => {
    const html = render("components/area-chart/macro.njk", `
      {% from "components/area-chart/macro.njk" import areaChart %}
      {{ areaChart({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("area-chart");
  });
});
