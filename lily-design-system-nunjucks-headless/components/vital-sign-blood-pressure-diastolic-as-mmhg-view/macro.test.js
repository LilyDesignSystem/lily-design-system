import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-blood-pressure-diastolic-as-mmhg-view", () => {
  const name = "vital-sign-blood-pressure-diastolic-as-mmhg-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: 76 });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + unit correctly", () => {
    const { document } = render(name, { value: 76 });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("76");
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr.getAttribute("title")).toBe("millimetres of mercury");
    expect(abbr.textContent).toBe("mmHg");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(name, { value: 76, label: "Diastolic BP" });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Diastolic BP");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 95, classes: "elevated" });
    expect(document.querySelector(`span.${name}.elevated`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 76 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
