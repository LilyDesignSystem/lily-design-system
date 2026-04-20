import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("measurement-system-input", () => {
  it("renders a <select> with the supplied options", () => {
    const { document } = render("measurement-system-input", {
      value: "metric",
      systems: [
        { value: "metric", text: "Metric" },
        { value: "imperial", text: "Imperial" },
      ],
      label: "System",
    });
    const sel = document.querySelector("select.measurement-system-input");
    expect(sel).toBeTruthy();
    expect(sel.getAttribute("aria-label")).toBe("System");
    expect(sel.querySelectorAll("option").length).toBe(2);
    expect(sel.querySelector("option[selected]").getAttribute("value"))
      .toBe("metric");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("measurement-system-input", { systems: [] });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
