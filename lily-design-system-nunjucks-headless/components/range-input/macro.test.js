import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("range-input", () => {
  it("renders an <input type=range> with the base class", () => {
    const { document } = render("range-input", { id: "r" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("range");
    expect(el.classList.contains("range-input")).toBe(true);
  });

  it("renders value, min, max, step", () => {
    const { document } = render("range-input", {
      id: "r",
      value: 50,
      min: 0,
      max: 100,
      step: 5,
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("value")).toBe("50");
    expect(el.getAttribute("min")).toBe("0");
    expect(el.getAttribute("max")).toBe("100");
    expect(el.getAttribute("step")).toBe("5");
  });

  it("accepts value=0 and min=0 as valid", () => {
    const { document } = render("range-input", {
      id: "r",
      value: 0,
      min: 0,
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("value")).toBe("0");
    expect(el.getAttribute("min")).toBe("0");
  });

  it("supports a linked datalist via params.list", () => {
    const { document } = render("range-input", {
      id: "r",
      list: "ticks",
    });
    expect(document.querySelector("input").getAttribute("list")).toBe("ticks");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("range-input", {
      id: "r",
      label: "Volume",
    });
    expect(document.querySelector("input").getAttribute("aria-label"))
      .toBe("Volume");
  });

  it("supports disabled, aria-invalid", () => {
    const { document } = render("range-input", {
      id: "r",
      disabled: true,
      invalid: true,
    });
    const el = document.querySelector("input");
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("range-input", { id: "r", classes: "narrow" });
    expect(document.querySelector("input.range-input.narrow")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("range-input", { id: "r" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
