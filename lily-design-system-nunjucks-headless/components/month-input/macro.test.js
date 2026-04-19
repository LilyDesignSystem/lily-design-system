import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("month-input", () => {
  it("renders an <input type=month> with the base class", () => {
    const { document } = render("month-input", { id: "m" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("month");
    expect(el.classList.contains("month-input")).toBe(true);
  });

  it("renders YYYY-MM value, min, max", () => {
    const { document } = render("month-input", {
      id: "m",
      value: "2026-04",
      min: "2026-01",
      max: "2026-12",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("value")).toBe("2026-04");
    expect(el.getAttribute("min")).toBe("2026-01");
    expect(el.getAttribute("max")).toBe("2026-12");
  });

  it("supports required, disabled, aria-invalid", () => {
    const { document } = render("month-input", {
      id: "m",
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
    const { document } = render("month-input", { id: "m", classes: "wide" });
    expect(document.querySelector("input.month-input.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("month-input", { id: "m" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
