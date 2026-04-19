import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("ireland-individual-health-identifier-input", () => {
  it("renders an <input type=text> with the base class", () => {
    const { document } = render(
      "ireland-individual-health-identifier-input",
      { id: "ihi" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains(
      "ireland-individual-health-identifier-input",
    )).toBe(true);
  });

  it("sets inputmode=numeric and autocomplete=off", () => {
    const { document } = render(
      "ireland-individual-health-identifier-input",
      { id: "ihi" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("inputmode")).toBe("numeric");
    expect(el.getAttribute("autocomplete")).toBe("off");
  });

  it("renders value", () => {
    const { document } = render(
      "ireland-individual-health-identifier-input",
      { id: "ihi", value: "1234 567" },
    );
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("1234 567");
  });

  it("supports aria-invalid and aria-errormessage", () => {
    const { document } = render(
      "ireland-individual-health-identifier-input",
      { id: "ihi", invalid: true, errormessage: "ihi-err" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("ihi-err");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "ireland-individual-health-identifier-input",
      { id: "ihi", classes: "wide" },
    );
    expect(document.querySelector(
      "input.ireland-individual-health-identifier-input.wide",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "ireland-individual-health-identifier-input",
      { id: "ihi" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
