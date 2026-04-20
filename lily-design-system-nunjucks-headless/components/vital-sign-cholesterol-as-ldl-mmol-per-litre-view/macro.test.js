import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-cholesterol-as-ldl-mmol-per-litre-view", () => {
  const name = "vital-sign-cholesterol-as-ldl-mmol-per-litre-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: "3.2" });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + 'millimoles per litre' unit", () => {
    const { document } = render(name, { value: "3.2" });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("3.2");
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr.getAttribute("title")).toBe("millimoles per litre");
    expect(abbr.textContent).toBe("mmol/L");
  });

  it("sets aria-label", () => {
    const { document } = render(name, { value: "3.2", label: "LDL" });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("LDL");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: "4.5", classes: "elevated" });
    expect(document.querySelector(`span.${name}.elevated`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: "3.2" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
