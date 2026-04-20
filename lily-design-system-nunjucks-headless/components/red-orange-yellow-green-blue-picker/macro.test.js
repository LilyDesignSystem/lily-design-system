import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("red-orange-yellow-green-blue-picker", () => {
  it("renders a <div role=radiogroup> with the base class", () => {
    const { document } = render("red-orange-yellow-green-blue-picker", {
      label: "Status",
    });
    const el = document.querySelector("div.red-orange-yellow-green-blue-picker");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
    expect(el.getAttribute("aria-label")).toBe("Status");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("red-orange-yellow-green-blue-picker", {
      label: "x",
      labelledBy: "h",
    });
    const el = document.querySelector("div.red-orange-yellow-green-blue-picker");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "red-orange-yellow-green-blue-picker",
      { label: "x" },
      '<button class="red-orange-yellow-green-blue-picker-button">Red</button>',
    );
    expect(
      document.querySelector(
        "div.red-orange-yellow-green-blue-picker .red-orange-yellow-green-blue-picker-button",
      ),
    ).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("red-orange-yellow-green-blue-picker", {
      label: "x",
      classes: "inline",
    });
    expect(
      document.querySelector("div.red-orange-yellow-green-blue-picker.inline"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("red-orange-yellow-green-blue-picker", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
