import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("datetime-local-input", () => {
  it("renders an <input type=datetime-local> with the base class", () => {
    const { document } = render("datetime-local-input", { id: "d" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("datetime-local");
    expect(el.classList.contains("datetime-local-input")).toBe(true);
  });

  it("renders ISO datetime value", () => {
    const { document } = render("datetime-local-input", {
      id: "appt",
      value: "2026-04-27T09:30",
    });
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("2026-04-27T09:30");
  });

  it("renders min, max, step", () => {
    const { document } = render("datetime-local-input", {
      id: "d",
      min: "2026-01-01T00:00",
      max: "2026-12-31T23:59",
      step: 900,
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("2026-01-01T00:00");
    expect(el.getAttribute("max")).toBe("2026-12-31T23:59");
    expect(el.getAttribute("step")).toBe("900");
  });

  it("supports required, disabled, readonly, aria-invalid", () => {
    const { document } = render("datetime-local-input", {
      id: "d",
      required: true,
      disabled: true,
      readonly: true,
      invalid: true,
    });
    const el = document.querySelector("input");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.hasAttribute("readonly")).toBe(true);
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("datetime-local-input", {
      id: "d",
      classes: "wide",
    });
    expect(document.querySelector("input.datetime-local-input.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("datetime-local-input", { id: "d" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
