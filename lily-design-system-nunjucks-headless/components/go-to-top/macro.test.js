import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("backToTop macro", () => {
  it("renders the component", () => {
    const html = render("components/go-to-top/macro.njk", `
      {% from "components/go-to-top/macro.njk" import backToTop %}
      {{ backToTop({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("go-to-top");
  });
});
