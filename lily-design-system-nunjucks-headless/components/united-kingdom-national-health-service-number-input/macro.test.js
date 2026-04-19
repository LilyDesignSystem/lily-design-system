import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("united-kingdom-national-health-service-number-input", () => {
  it("renders an <input type=text> with the base class", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-input",
      { id: "nhs" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains(
      "united-kingdom-national-health-service-number-input",
    )).toBe(true);
  });

  it("sets inputmode=numeric and a digit pattern", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-input",
      { id: "nhs" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("inputmode")).toBe("numeric");
    expect(el.getAttribute("pattern")).toMatch(/^\[0-9/);
  });

  it("sets autocomplete='off' and spellcheck='false'", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-input",
      { id: "nhs" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("autocomplete")).toBe("off");
    expect(el.getAttribute("spellcheck")).toBe("false");
  });

  it("renders value", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-input",
      { id: "nhs", value: "485 777 3456" },
    );
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("485 777 3456");
  });

  it("supports aria-invalid and aria-errormessage", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-input",
      { id: "nhs", invalid: true, errormessage: "nhs-err" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("nhs-err");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-input",
      { id: "nhs", classes: "wide" },
    );
    expect(document.querySelector(
      "input.united-kingdom-national-health-service-number-input.wide",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "united-kingdom-national-health-service-number-input",
      { id: "nhs" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
