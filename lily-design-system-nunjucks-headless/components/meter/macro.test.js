import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("meter", () => {
  it("renders a <meter> with value, min, max", () => {
    const { document } = render("meter", { value: 7, min: 0, max: 10 });
    const el = document.querySelector("meter.meter");
    expect(el).toBeTruthy();
    expect(el.getAttribute("value")).toBe("7");
    expect(el.getAttribute("min")).toBe("0");
    expect(el.getAttribute("max")).toBe("10");
  });

  it("passes low, high, and optimum when provided", () => {
    const { document } = render("meter", {
      value: 50,
      min: 0,
      max: 100,
      low: 30,
      high: 70,
      optimum: 80,
    });
    const el = document.querySelector("meter");
    expect(el.getAttribute("low")).toBe("30");
    expect(el.getAttribute("high")).toBe("70");
    expect(el.getAttribute("optimum")).toBe("80");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("meter", { value: 1 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
