import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-heart-rate-variability-input", () => {
  const name = "vital-sign-heart-rate-variability-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "hrv" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=1, max=250, step=1", () => {
    const { document } = render(name, { id: "hrv" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("1");
    expect(el.getAttribute("max")).toBe("250");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("renders value", () => {
    const { document } = render(name, { id: "hrv", value: 48 });
    expect(document.querySelector("input").getAttribute("value")).toBe("48");
  });

  it("appends params.classes and aria-invalid", () => {
    const { document } = render(name, {
      id: "hrv",
      classes: "narrow",
      invalid: true,
    });
    const el = document.querySelector(`input.${name}.narrow`);
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "hrv" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
