import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("one-time-password-input", () => {
  const q = (p) => render("one-time-password-input", { label: "Code", length: 6, ...p }).document.querySelector("input");
  it("renders a single <input type=text> with the base class", () => {
    const el = q({});
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains("one-time-password-input")).toBe(true);
  });
  it("defaults inputmode to numeric and allows override", () => {
    expect(q({}).getAttribute("inputmode")).toBe("numeric");
    expect(q({ inputMode: "text" }).getAttribute("inputmode")).toBe("text");
  });
  it("sets autocomplete=one-time-code, autocapitalize=off, spellcheck=false", () => {
    const el = q({});
    expect(el.getAttribute("autocomplete")).toBe("one-time-code");
    expect(el.getAttribute("autocapitalize")).toBe("off");
    expect(el.getAttribute("spellcheck")).toBe("false");
  });
  it("maps length to maxlength and data-length", () => {
    const el = q({ length: 8 });
    expect(el.getAttribute("maxlength")).toBe("8");
    expect(el.getAttribute("data-length")).toBe("8");
  });
  it("has no default length", () => {
    const el = render("one-time-password-input", { label: "Code" }).document.querySelector("input");
    expect(el.hasAttribute("maxlength")).toBe(false);
  });
  it("defaults pattern to [0-9]* and allows override", () => {
    expect(q({}).getAttribute("pattern")).toBe("[0-9]*");
    expect(q({ pattern: "[A-Z0-9]*" }).getAttribute("pattern")).toBe("[A-Z0-9]*");
  });
  it("uses label as aria-label", () => {
    expect(q({}).getAttribute("aria-label")).toBe("Code");
  });
  it("renders value, name, required, disabled", () => {
    const el = q({ value: "123", name: "otp", required: true, disabled: true });
    expect(el.getAttribute("value")).toBe("123");
    expect(el.getAttribute("name")).toBe("otp");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
  });
  it("appends classes and spreads attributes on the root", () => {
    const el = q({ classes: "extra", attributes: { "data-x": "1" } });
    expect(el.classList.contains("extra")).toBe(true);
    expect(el.getAttribute("data-x")).toBe("1");
  });
  it("contains no <style> or <script> tags", () => {
    const { html } = render("one-time-password-input", { label: "Code", length: 6 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
