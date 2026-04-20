import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-total-sleep-time-as-min-per-day-view", () => {
  const name = "vital-sign-total-sleep-time-as-min-per-day-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: 450 });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + 'minutes per day' unit", () => {
    const { document } = render(name, { value: 450 });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("450");
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr.getAttribute("title")).toBe("minutes per day");
    expect(abbr.textContent).toBe("min/day");
  });

  it("sets aria-label", () => {
    const { document } = render(name, {
      value: 450,
      label: "Total sleep time",
    });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Total sleep time");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 240, classes: "short" });
    expect(document.querySelector(`span.${name}.short`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 450 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
