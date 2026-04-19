import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("date-input", () => {
  it("renders an <input type=date> with the base class", () => {
    const { document } = render("date-input", { id: "d" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("date");
    expect(el.classList.contains("date-input")).toBe(true);
  });

  it("renders ISO value", () => {
    const { document } = render("date-input", {
      id: "dob",
      value: "1985-04-27",
    });
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("1985-04-27");
  });

  it("renders min and max", () => {
    const { document } = render("date-input", {
      id: "d",
      min: "2026-01-01",
      max: "2026-12-31",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("2026-01-01");
    expect(el.getAttribute("max")).toBe("2026-12-31");
  });

  it("renders step", () => {
    const { document } = render("date-input", { id: "d", step: 7 });
    expect(document.querySelector("input").getAttribute("step")).toBe("7");
  });

  it("supports required, disabled, readonly, aria-invalid", () => {
    const { document } = render("date-input", {
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
    const { document } = render("date-input", { id: "d", classes: "narrow" });
    expect(document.querySelector("input.date-input.narrow")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("date-input", { id: "d" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
