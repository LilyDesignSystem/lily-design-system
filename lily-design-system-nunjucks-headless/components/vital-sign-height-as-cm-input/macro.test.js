import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-height-as-cm-input", () => {
  const name = "vital-sign-height-as-cm-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "ht" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=30, max=250, step=1, inputmode=numeric", () => {
    const { document } = render(name, { id: "ht" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("30");
    expect(el.getAttribute("max")).toBe("250");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("renders value and aria-invalid", () => {
    const { document } = render(name, { id: "ht", value: 168, invalid: true });
    const el = document.querySelector("input");
    expect(el.getAttribute("value")).toBe("168");
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { id: "ht", classes: "narrow" });
    expect(document.querySelector(`input.${name}.narrow`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "ht" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
