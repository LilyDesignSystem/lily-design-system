import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-weight-as-kg-input", () => {
  const name = "vital-sign-weight-as-kg-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "wt" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=0, max=400, step=0.1, inputmode=decimal", () => {
    const { document } = render(name, { id: "wt" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("0");
    expect(el.getAttribute("max")).toBe("400");
    expect(el.getAttribute("step")).toBe("0.1");
    expect(el.getAttribute("inputmode")).toBe("decimal");
  });

  it("renders decimal value", () => {
    const { document } = render(name, { id: "wt", value: "62.5" });
    expect(document.querySelector("input").getAttribute("value")).toBe("62.5");
  });

  it("appends params.classes and aria-invalid", () => {
    const { document } = render(name, {
      id: "wt",
      classes: "narrow",
      invalid: true,
    });
    const el = document.querySelector(`input.${name}.narrow`);
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "wt" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
