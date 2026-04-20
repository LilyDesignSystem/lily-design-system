import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-body-fat-as-percentage-input", () => {
  const name = "vital-sign-body-fat-as-percentage-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "bf" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=2, max=80, step=0.1, inputmode=decimal", () => {
    const { document } = render(name, { id: "bf" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("2");
    expect(el.getAttribute("max")).toBe("80");
    expect(el.getAttribute("step")).toBe("0.1");
    expect(el.getAttribute("inputmode")).toBe("decimal");
  });

  it("renders decimal value", () => {
    const { document } = render(name, { id: "bf", value: "22.5" });
    expect(document.querySelector("input").getAttribute("value")).toBe("22.5");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { id: "bf", classes: "narrow" });
    expect(document.querySelector(`input.${name}.narrow`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "bf" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
