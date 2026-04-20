import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-vo2-max-as-ml-per-kg-per-minute-input", () => {
  const name = "vital-sign-vo2-max-as-ml-per-kg-per-minute-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "vo2" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=5, max=90, step=1, inputmode=numeric", () => {
    const { document } = render(name, { id: "vo2" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("5");
    expect(el.getAttribute("max")).toBe("90");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("renders value", () => {
    const { document } = render(name, { id: "vo2", value: 42 });
    expect(document.querySelector("input").getAttribute("value")).toBe("42");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { id: "vo2", classes: "narrow" });
    expect(document.querySelector(`input.${name}.narrow`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "vo2" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
