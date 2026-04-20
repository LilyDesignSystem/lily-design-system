import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-weight-as-kg-view", () => {
  const name = "vital-sign-weight-as-kg-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: "62.5" });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + 'kilograms' unit", () => {
    const { document } = render(name, { value: "62.5" });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("62.5");
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr.getAttribute("title")).toBe("kilograms");
    expect(abbr.textContent).toBe("kg");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(name, { value: "62.5", label: "Weight" });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Weight");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: "62.5", classes: "primary" });
    expect(document.querySelector(`span.${name}.primary`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: "62.5" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
