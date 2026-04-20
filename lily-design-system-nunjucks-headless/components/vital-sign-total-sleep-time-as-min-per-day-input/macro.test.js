import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-total-sleep-time-as-min-per-day-input", () => {
  const name = "vital-sign-total-sleep-time-as-min-per-day-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "tst" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=0, max=1440, step=1, inputmode=numeric", () => {
    const { document } = render(name, { id: "tst" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("0");
    expect(el.getAttribute("max")).toBe("1440");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("renders value", () => {
    const { document } = render(name, { id: "tst", value: 450 });
    expect(document.querySelector("input").getAttribute("value")).toBe("450");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { id: "tst", classes: "narrow" });
    expect(document.querySelector(`input.${name}.narrow`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "tst" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
