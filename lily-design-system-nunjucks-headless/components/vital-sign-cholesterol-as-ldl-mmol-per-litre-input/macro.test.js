import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-cholesterol-as-ldl-mmol-per-litre-input", () => {
  const name = "vital-sign-cholesterol-as-ldl-mmol-per-litre-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "ldl" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=0.1, max=10, step=0.1, inputmode=decimal", () => {
    const { document } = render(name, { id: "ldl" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("0.1");
    expect(el.getAttribute("max")).toBe("10");
    expect(el.getAttribute("step")).toBe("0.1");
    expect(el.getAttribute("inputmode")).toBe("decimal");
  });

  it("renders decimal value", () => {
    const { document } = render(name, { id: "ldl", value: "3.2" });
    expect(document.querySelector("input").getAttribute("value")).toBe("3.2");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { id: "ldl", classes: "narrow" });
    expect(document.querySelector(`input.${name}.narrow`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "ldl" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
