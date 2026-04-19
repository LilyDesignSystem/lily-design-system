import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("postal-code-input", () => {
  it("renders an <input type=text> with the base class", () => {
    const { document } = render("postal-code-input", { id: "pc" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains("postal-code-input")).toBe(true);
  });

  it("defaults autocomplete to 'postal-code'", () => {
    const { document } = render("postal-code-input", { id: "pc" });
    expect(document.querySelector("input").getAttribute("autocomplete"))
      .toBe("postal-code");
  });

  it("respects a custom autocomplete", () => {
    const { document } = render("postal-code-input", {
      id: "pc",
      autocomplete: "shipping postal-code",
    });
    expect(document.querySelector("input").getAttribute("autocomplete"))
      .toBe("shipping postal-code");
  });

  it("defaults maxlength to 10", () => {
    const { document } = render("postal-code-input", { id: "pc" });
    expect(document.querySelector("input").getAttribute("maxlength"))
      .toBe("10");
  });

  it("respects a custom pattern", () => {
    const { document } = render("postal-code-input", {
      id: "pc",
      pattern: "[A-Z0-9 ]{3,10}",
    });
    expect(document.querySelector("input").getAttribute("pattern"))
      .toBe("[A-Z0-9 ]{3,10}");
  });

  it("renders value", () => {
    const { document } = render("postal-code-input", {
      id: "pc",
      value: "SW1A 1AA",
    });
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("SW1A 1AA");
  });

  it("supports required, disabled, aria-invalid", () => {
    const { document } = render("postal-code-input", {
      id: "pc",
      required: true,
      disabled: true,
      invalid: true,
    });
    const el = document.querySelector("input");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("postal-code-input", {
      id: "pc",
      classes: "narrow",
    });
    expect(document.querySelector("input.postal-code-input.narrow")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("postal-code-input", { id: "pc" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
