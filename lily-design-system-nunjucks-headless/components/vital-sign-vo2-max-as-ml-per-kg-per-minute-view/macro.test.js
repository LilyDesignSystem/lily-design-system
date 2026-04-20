import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-vo2-max-as-ml-per-kg-per-minute-view", () => {
  const name = "vital-sign-vo2-max-as-ml-per-kg-per-minute-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: 42 });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + 'ml/kg/min' unit", () => {
    const { document } = render(name, { value: 42 });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("42");
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr.getAttribute("title")).toBe(
      "millilitres per kilogram per minute",
    );
    expect(abbr.textContent).toBe("ml/kg/min");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(name, { value: 42, label: "VO₂ max" });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("VO₂ max");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 58, classes: "elite" });
    expect(document.querySelector(`span.${name}.elite`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 42 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
