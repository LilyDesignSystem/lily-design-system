import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("color-picker-button", () => {
  it("renders a <button role=radio> with the color", () => {
    const { document } = render("color-picker-button", {
      color: "#ff0000",
      label: "Red",
    });
    const el = document.querySelector("button.color-picker-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radio");
    expect(el.getAttribute("data-color")).toBe("#ff0000");
    expect(el.getAttribute("aria-label")).toBe("Red");
  });

  it("sets aria-checked and tabindex when checked", () => {
    const { document } = render("color-picker-button", {
      color: "#f00",
      checked: true,
    });
    const el = document.querySelector("button");
    expect(el.getAttribute("aria-checked")).toBe("true");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  it("contains no <script> tags in output", () => {
    const { html } = render("color-picker-button", { color: "#fff" });
    expect(html).not.toContain("<script");
  });
});
