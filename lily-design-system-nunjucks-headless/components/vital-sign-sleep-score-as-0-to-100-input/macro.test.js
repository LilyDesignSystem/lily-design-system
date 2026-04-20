import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-sleep-score-as-0-to-100-input", () => {
  const name = "vital-sign-sleep-score-as-0-to-100-input";

  it("renders an <input type=number> with the base class", () => {
    const { document } = render(name, { id: "score" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(name)).toBe(true);
  });

  it("defaults min=0, max=100, step=1, inputmode=numeric", () => {
    const { document } = render(name, { id: "score" });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("0");
    expect(el.getAttribute("max")).toBe("100");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("renders value", () => {
    const { document } = render(name, { id: "score", value: 82 });
    expect(document.querySelector("input").getAttribute("value")).toBe("82");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { id: "score", classes: "narrow" });
    expect(document.querySelector(`input.${name}.narrow`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { id: "score" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
