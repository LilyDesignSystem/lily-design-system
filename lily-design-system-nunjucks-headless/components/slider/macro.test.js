import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("slider", () => {
  it("renders an <input type=range> with the base class", () => {
    const { document } = render("slider", {
      id: "s",
      value: 50,
      label: "Volume",
    });
    const el = document.querySelector("input.slider");
    expect(el).toBeTruthy();
    expect(el.getAttribute("type")).toBe("range");
    expect(el.getAttribute("value")).toBe("50");
    expect(el.getAttribute("aria-label")).toBe("Volume");
  });

  it("respects min, max, step", () => {
    const { document } = render("slider", { min: 10, max: 20, step: 0.5 });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("10");
    expect(el.getAttribute("max")).toBe("20");
    expect(el.getAttribute("step")).toBe("0.5");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("slider", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
