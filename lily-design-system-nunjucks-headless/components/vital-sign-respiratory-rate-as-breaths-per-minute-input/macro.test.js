import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-respiratory-rate-as-breaths-per-minute-input", () => {
  const name = "vital-sign-respiratory-rate-as-breaths-per-minute-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "rr" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=4, max=60, step=1", () => {
    const { document } = render(name, { id: "rr" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("4");
    expect(el.getAttribute("max")).toBe("60");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("renders value and aria-invalid", () => {
    const { document } = render(name, { id: "rr", value: 16, invalid: true });
    const el = document.querySelector("input");
    expect(el.getAttribute("value")).toBe("16");
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { id: "rr", classes: "narrow" });
    expect(document.querySelector(`input.${name}.narrow`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "rr" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
