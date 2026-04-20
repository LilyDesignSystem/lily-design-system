import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-blood-pressure-diastolic-as-mmhg-input", () => {
  const name = "vital-sign-blood-pressure-diastolic-as-mmhg-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "dia" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=30, max=150, step=1", () => {
    const { document } = render(name, { id: "dia" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("30");
    expect(el.getAttribute("max")).toBe("150");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("renders value and aria-invalid", () => {
    const { document } = render(name, { id: "dia", value: 76, invalid: true });
    const el = document.querySelector("input");
    expect(el.getAttribute("value")).toBe("76");
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { id: "dia", classes: "narrow" });
    expect(document.querySelector(`input.${name}.narrow`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "dia" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
