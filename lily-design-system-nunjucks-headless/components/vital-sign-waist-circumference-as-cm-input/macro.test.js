import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-waist-circumference-as-cm-input", () => {
  const name = "vital-sign-waist-circumference-as-cm-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "ws" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=30, max=200, step=1, inputmode=numeric", () => {
    const { document } = render(name, { id: "ws" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("30");
    expect(el.getAttribute("max")).toBe("200");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("renders value", () => {
    const { document } = render(name, { id: "ws", value: 84 });
    expect(document.querySelector("input").getAttribute("value")).toBe("84");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { id: "ws", classes: "narrow" });
    expect(document.querySelector(`input.${name}.narrow`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "ws" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
