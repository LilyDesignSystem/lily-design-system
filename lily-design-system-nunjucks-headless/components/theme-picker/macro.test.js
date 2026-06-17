import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("theme-select", () => {
  it("renders a <div role=radiogroup> with the base class", () => {
    const { document } = render("theme-select", { label: "Theme" });
    const el = document.querySelector("div.theme-select");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
    expect(el.getAttribute("aria-label")).toBe("Theme");
  });

  it("defaults aria-label to 'Theme'", () => {
    const { document } = render("theme-select", {});
    expect(document.querySelector("div.theme-select").getAttribute("aria-label"))
      .toBe("Theme");
  });

  it("renders caller content", () => {
    const { document } = render(
      "theme-select",
      {},
      '<button class="theme-select-button"></button>',
    );
    expect(
      document.querySelector("div.theme-select .theme-select-button"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("theme-select", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
