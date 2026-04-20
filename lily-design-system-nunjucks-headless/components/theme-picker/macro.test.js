import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("theme-picker", () => {
  it("renders a <div role=radiogroup> with the base class", () => {
    const { document } = render("theme-picker", { label: "Theme" });
    const el = document.querySelector("div.theme-picker");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
    expect(el.getAttribute("aria-label")).toBe("Theme");
  });

  it("defaults aria-label to 'Theme'", () => {
    const { document } = render("theme-picker", {});
    expect(document.querySelector("div.theme-picker").getAttribute("aria-label"))
      .toBe("Theme");
  });

  it("renders caller content", () => {
    const { document } = render(
      "theme-picker",
      {},
      '<button class="theme-picker-button"></button>',
    );
    expect(
      document.querySelector("div.theme-picker .theme-picker-button"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("theme-picker", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
