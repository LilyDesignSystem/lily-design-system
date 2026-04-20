import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("theme-select-option", () => {
  it("renders an <option> with value and default text", () => {
    const { document } = render("theme-select-option", { value: "dark" });
    const el = document.querySelector("option.theme-select-option");
    expect(el).toBeTruthy();
    expect(el.getAttribute("value")).toBe("dark");
    expect(el.textContent.trim()).toBe("dark");
  });

  it("uses text override when provided", () => {
    const { document } = render("theme-select-option", {
      value: "dark",
      text: "Dark mode",
    });
    expect(document.querySelector("option").textContent.trim())
      .toBe("Dark mode");
  });

  it("supports selected and disabled", () => {
    const { document } = render("theme-select-option", {
      value: "dark",
      selected: true,
      disabled: true,
    });
    const el = document.querySelector("option");
    expect(el.hasAttribute("selected")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("theme-select-option", { value: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
