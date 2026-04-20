import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-respiratory-rate-as-breaths-per-minute-view", () => {
  const name = "vital-sign-respiratory-rate-as-breaths-per-minute-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: 16 });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + 'breaths per minute' unit", () => {
    const { document } = render(name, { value: 16 });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("16");
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr.getAttribute("title")).toBe("breaths per minute");
    expect(abbr.textContent).toBe("br/min");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(name, {
      value: 16,
      label: "Respiratory rate",
    });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Respiratory rate");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 22, classes: "tachypnea" });
    expect(document.querySelector(`span.${name}.tachypnea`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 16 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
