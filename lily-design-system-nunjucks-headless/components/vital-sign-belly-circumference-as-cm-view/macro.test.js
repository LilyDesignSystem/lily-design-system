import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-belly-circumference-as-cm-view", () => {
  const name = "vital-sign-belly-circumference-as-cm-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: 168 });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + 'centimetres' unit", () => {
    const { document } = render(name, { value: 168 });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("168");
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr.getAttribute("title")).toBe("centimetres");
    expect(abbr.textContent).toBe("cm");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(name, { value: 168, label: "Belly circumference" });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Belly circumference");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 168, classes: "primary" });
    expect(document.querySelector(`span.${name}.primary`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 168 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
