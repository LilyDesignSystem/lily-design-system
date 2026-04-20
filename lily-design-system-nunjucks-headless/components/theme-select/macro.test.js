import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("theme-select", () => {
  it("renders a <select> with the base class", () => {
    const { document } = render("theme-select", { label: "Theme" });
    const el = document.querySelector("select.theme-select");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Theme");
  });

  it("supports required and disabled", () => {
    const { document } = render("theme-select", {
      label: "x",
      required: true,
      disabled: true,
    });
    const el = document.querySelector("select");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("renders caller content", () => {
    const { document } = render(
      "theme-select",
      { label: "x" },
      '<option value="dark">Dark</option>',
    );
    expect(document.querySelector("select option[value=dark]")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("theme-select", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
