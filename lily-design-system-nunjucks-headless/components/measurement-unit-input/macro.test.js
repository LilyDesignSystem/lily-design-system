import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("measurement-unit-input", () => {
  it("renders a <select> with the supplied options", () => {
    const { document } = render("measurement-unit-input", {
      value: "cm",
      units: [
        { value: "cm", text: "cm" },
        { value: "in", text: "in" },
      ],
      label: "Unit",
    });
    const sel = document.querySelector("select.measurement-unit-input");
    expect(sel).toBeTruthy();
    expect(sel.querySelector("option[selected]").getAttribute("value"))
      .toBe("cm");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("measurement-unit-input", { units: [] });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
