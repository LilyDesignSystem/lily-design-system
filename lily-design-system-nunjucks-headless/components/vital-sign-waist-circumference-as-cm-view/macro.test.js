import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-waist-circumference-as-cm-view", () => {
  const name = "vital-sign-waist-circumference-as-cm-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: 84 });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + 'centimetres' unit", () => {
    const { document } = render(name, { value: 84 });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("84");
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr.getAttribute("title")).toBe("centimetres");
    expect(abbr.textContent).toBe("cm");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(name, { value: 84, label: "Waist" });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Waist");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 102, classes: "elevated" });
    expect(document.querySelector(`span.${name}.elevated`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 84 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
