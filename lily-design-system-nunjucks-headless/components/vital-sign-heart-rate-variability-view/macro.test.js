import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-heart-rate-variability-view", () => {
  const name = "vital-sign-heart-rate-variability-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: 48 });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + 'milliseconds' unit", () => {
    const { document } = render(name, { value: 48 });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("48");
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr.getAttribute("title")).toBe("milliseconds");
    expect(abbr.textContent).toBe("ms");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(name, {
      value: 48,
      label: "Heart rate variability",
    });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Heart rate variability");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 22, classes: "low" });
    expect(document.querySelector(`span.${name}.low`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 48 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
