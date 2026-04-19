import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("color-input", () => {
  it("renders an <input type=color> with the base class", () => {
    const { document } = render("color-input", { id: "c" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("color");
    expect(el.classList.contains("color-input")).toBe(true);
  });

  it("defaults value to #000000", () => {
    const { document } = render("color-input", { id: "c" });
    expect(document.querySelector("input").getAttribute("value")).toBe("#000000");
  });

  it("respects a custom value", () => {
    const { document } = render("color-input", {
      id: "c",
      value: "#005eb8",
    });
    expect(document.querySelector("input").getAttribute("value")).toBe("#005eb8");
  });

  it("supports a linked datalist via params.list", () => {
    const { document } = render("color-input", {
      id: "c",
      list: "brand-palette",
    });
    expect(document.querySelector("input").getAttribute("list"))
      .toBe("brand-palette");
  });

  it("supports required, disabled, readonly, aria-invalid", () => {
    const { document } = render("color-input", {
      id: "c",
      required: true,
      disabled: true,
      readonly: true,
      invalid: true,
    });
    const el = document.querySelector("input");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.hasAttribute("readonly")).toBe(true);
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("color-input", { id: "c", classes: "swatch" });
    expect(document.querySelector("input.color-input.swatch")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("color-input", { id: "c" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
