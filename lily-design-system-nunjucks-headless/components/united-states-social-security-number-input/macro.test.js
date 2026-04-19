import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("united-states-social-security-number-input", () => {
  it("renders an <input type=text> with the base class", () => {
    const { document } = render(
      "united-states-social-security-number-input",
      { id: "ssn" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains(
      "united-states-social-security-number-input",
    )).toBe(true);
  });

  it("sets inputmode=numeric and a 9-digit pattern", () => {
    const { document } = render(
      "united-states-social-security-number-input",
      { id: "ssn" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("inputmode")).toBe("numeric");
    expect(el.getAttribute("pattern")).toMatch(/\[0-9/);
    expect(el.getAttribute("maxlength")).toBe("11");
  });

  it("sets autocomplete='off' and spellcheck='false'", () => {
    const { document } = render(
      "united-states-social-security-number-input",
      { id: "ssn" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("autocomplete")).toBe("off");
    expect(el.getAttribute("spellcheck")).toBe("false");
  });

  it("renders value", () => {
    const { document } = render(
      "united-states-social-security-number-input",
      { id: "ssn", value: "123-45-6789" },
    );
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("123-45-6789");
  });

  it("supports aria-invalid and aria-errormessage", () => {
    const { document } = render(
      "united-states-social-security-number-input",
      { id: "ssn", invalid: true, errormessage: "ssn-err" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("ssn-err");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "united-states-social-security-number-input",
      { id: "ssn", classes: "wide" },
    );
    expect(document.querySelector(
      "input.united-states-social-security-number-input.wide",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "united-states-social-security-number-input",
      { id: "ssn" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
