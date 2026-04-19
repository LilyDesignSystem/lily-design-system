import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("week-input", () => {
  it("renders an <input type=week> with the base class", () => {
    const { document } = render("week-input", { id: "w" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("week");
    expect(el.classList.contains("week-input")).toBe(true);
  });

  it("renders YYYY-Www value, min, max", () => {
    const { document } = render("week-input", {
      id: "w",
      value: "2026-W17",
      min: "2026-W01",
      max: "2026-W52",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("value")).toBe("2026-W17");
    expect(el.getAttribute("min")).toBe("2026-W01");
    expect(el.getAttribute("max")).toBe("2026-W52");
  });

  it("supports required, disabled, aria-invalid", () => {
    const { document } = render("week-input", {
      id: "w",
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
    const { document } = render("week-input", { id: "w", classes: "wide" });
    expect(document.querySelector("input.week-input.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("week-input", { id: "w" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
