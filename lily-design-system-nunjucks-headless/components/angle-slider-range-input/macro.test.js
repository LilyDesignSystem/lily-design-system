import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("angle-slider-range-input", () => {
  it("renders an <input type=range> with the base class", () => {
    const { document } = render("angle-slider-range-input", { id: "a", value: 90 });
    const el = document.querySelector("input.angle-slider-range-input");
    expect(el).toBeTruthy();
    expect(el.getAttribute("type")).toBe("range");
    expect(el.getAttribute("min")).toBe("0");
    expect(el.getAttribute("max")).toBe("360");
    expect(el.getAttribute("value")).toBe("90");
  });

  it("respects label and disabled", () => {
    const { document } = render("angle-slider-range-input", {
      label: "Rotation",
      disabled: true,
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-label")).toBe("Rotation");
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("angle-slider-range-input", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
