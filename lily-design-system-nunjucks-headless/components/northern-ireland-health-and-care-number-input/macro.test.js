import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("northern-ireland-health-and-care-number-input", () => {
  it("renders an <input type=text> with the base class", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-input",
      { id: "hc" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains(
      "northern-ireland-health-and-care-number-input",
    )).toBe(true);
  });

  it("sets inputmode=numeric and autocomplete=off", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-input",
      { id: "hc" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("inputmode")).toBe("numeric");
    expect(el.getAttribute("autocomplete")).toBe("off");
  });

  it("renders value", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-input",
      { id: "hc", value: "485 777 3456" },
    );
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("485 777 3456");
  });

  it("supports aria-invalid and aria-errormessage", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-input",
      { id: "hc", invalid: true, errormessage: "hc-err" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("hc-err");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-input",
      { id: "hc", classes: "wide" },
    );
    expect(document.querySelector(
      "input.northern-ireland-health-and-care-number-input.wide",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "northern-ireland-health-and-care-number-input",
      { id: "hc" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
