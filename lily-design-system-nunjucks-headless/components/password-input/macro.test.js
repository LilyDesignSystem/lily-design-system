import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("password-input", () => {
  it("renders an <input type=password> with the base class", () => {
    const { document } = render("password-input", { id: "p" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("password");
    expect(el.classList.contains("password-input")).toBe(true);
  });

  it("defaults name to id", () => {
    const { document } = render("password-input", { id: "password" });
    expect(document.querySelector("input").getAttribute("name")).toBe("password");
  });

  it("does not render a value attribute", () => {
    const { document } = render("password-input", { id: "p" });
    expect(document.querySelector("input").hasAttribute("value")).toBe(false);
  });

  it("supports autocomplete tokens", () => {
    const { document } = render("password-input", {
      id: "p",
      autocomplete: "new-password",
    });
    expect(document.querySelector("input").getAttribute("autocomplete"))
      .toBe("new-password");
  });

  it("supports required, disabled, readonly", () => {
    const { document } = render("password-input", {
      id: "p",
      required: true,
      disabled: true,
      readonly: true,
    });
    const el = document.querySelector("input");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.hasAttribute("readonly")).toBe(true);
  });

  it("sets aria-invalid and aria-errormessage", () => {
    const { document } = render("password-input", {
      id: "p",
      invalid: true,
      errormessage: "p-err",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("p-err");
  });

  it("supports minlength, maxlength, pattern", () => {
    const { document } = render("password-input", {
      id: "p",
      minlength: 8,
      maxlength: 64,
      pattern: "[A-Za-z0-9]+",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("minlength")).toBe("8");
    expect(el.getAttribute("maxlength")).toBe("64");
    expect(el.getAttribute("pattern")).toBe("[A-Za-z0-9]+");
  });

  it("appends params.classes", () => {
    const { document } = render("password-input", { id: "p", classes: "wide" });
    expect(document.querySelector("input.password-input.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("password-input", { id: "p" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
