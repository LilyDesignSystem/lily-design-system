import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("time-input", () => {
  it("renders an <input type=time> with the base class", () => {
    const { document } = render("time-input", { id: "t" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("time");
    expect(el.classList.contains("time-input")).toBe(true);
  });

  it("renders value in HH:MM", () => {
    const { document } = render("time-input", {
      id: "appt",
      value: "09:30",
    });
    expect(document.querySelector("input").getAttribute("value")).toBe("09:30");
  });

  it("renders min and max", () => {
    const { document } = render("time-input", {
      id: "t",
      min: "09:00",
      max: "17:00",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("09:00");
    expect(el.getAttribute("max")).toBe("17:00");
  });

  it("renders step", () => {
    const { document } = render("time-input", { id: "t", step: 900 });
    expect(document.querySelector("input").getAttribute("step")).toBe("900");
  });

  it("supports required, disabled, readonly, aria-invalid", () => {
    const { document } = render("time-input", {
      id: "t",
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
    const { document } = render("time-input", { id: "t", classes: "narrow" });
    expect(document.querySelector("input.time-input.narrow")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("time-input", { id: "t" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
