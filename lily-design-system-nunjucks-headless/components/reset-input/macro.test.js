import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("reset-input", () => {
  it("renders an <input type=reset> with the base class", () => {
    const { document } = render("reset-input", {});
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("reset");
    expect(el.classList.contains("reset-input")).toBe(true);
  });

  it("defaults value to 'Reset'", () => {
    const { document } = render("reset-input", {});
    expect(document.querySelector("input").getAttribute("value")).toBe("Reset");
  });

  it("respects a custom value", () => {
    const { document } = render("reset-input", { value: "Start over" });
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("Start over");
  });

  it("sets id and name when provided", () => {
    const { document } = render("reset-input", {
      id: "reset",
      name: "action",
      value: "Reset",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("id")).toBe("reset");
    expect(el.getAttribute("name")).toBe("action");
  });

  it("supports disabled", () => {
    const { document } = render("reset-input", { disabled: true });
    expect(document.querySelector("input").hasAttribute("disabled")).toBe(true);
  });

  it("sets aria-label when provided", () => {
    const { document } = render("reset-input", {
      value: "↺",
      label: "Reset the form",
    });
    expect(document.querySelector("input").getAttribute("aria-label"))
      .toBe("Reset the form");
  });

  it("appends params.classes", () => {
    const { document } = render("reset-input", { classes: "secondary" });
    expect(document.querySelector("input.reset-input.secondary")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("reset-input", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
