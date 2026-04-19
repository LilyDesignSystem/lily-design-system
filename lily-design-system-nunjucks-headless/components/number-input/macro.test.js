import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("number-input", () => {
  it("renders an <input type=number> with the base class", () => {
    const { document } = render("number-input", { id: "n" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains("number-input")).toBe(true);
  });

  it("renders min, max, and step", () => {
    const { document } = render("number-input", {
      id: "n",
      min: 0,
      max: 100,
      step: 5,
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("0");
    expect(el.getAttribute("max")).toBe("100");
    expect(el.getAttribute("step")).toBe("5");
  });

  it("accepts min=0 as valid", () => {
    const { document } = render("number-input", { id: "n", min: 0 });
    expect(document.querySelector("input").getAttribute("min")).toBe("0");
  });

  it("renders value", () => {
    const { document } = render("number-input", { id: "n", value: 42 });
    expect(document.querySelector("input").getAttribute("value")).toBe("42");
  });

  it("supports inputmode", () => {
    const { document } = render("number-input", {
      id: "n",
      inputmode: "decimal",
    });
    expect(document.querySelector("input").getAttribute("inputmode"))
      .toBe("decimal");
  });

  it("sets aria-invalid when invalid", () => {
    const { document } = render("number-input", { id: "n", invalid: true });
    expect(document.querySelector("input").getAttribute("aria-invalid"))
      .toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("number-input", { id: "n", classes: "small" });
    expect(document.querySelector("input.number-input.small")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("number-input", { id: "n" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
