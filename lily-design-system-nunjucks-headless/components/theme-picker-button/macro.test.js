import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("theme-select-button", () => {
  it("renders a <button role=radio> with the base class", () => {
    const { document } = render("theme-select-button", { theme: "dark" });
    const el = document.querySelector("button.theme-select-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radio");
    expect(el.getAttribute("data-theme")).toBe("dark");
    expect(el.textContent.trim()).toBe("dark");
  });

  it("sets aria-checked and tabindex when checked", () => {
    const { document } = render("theme-select-button", {
      theme: "dark",
      checked: true,
    });
    const el = document.querySelector("button");
    expect(el.getAttribute("aria-checked")).toBe("true");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  it("uses text override when provided", () => {
    const { document } = render("theme-select-button", {
      theme: "dark",
      text: "Dark mode",
    });
    expect(document.querySelector("button").textContent.trim()).toBe("Dark mode");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("theme-select-button", { theme: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
