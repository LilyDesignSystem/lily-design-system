import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("text-input", () => {
  it("renders an <input type=text> with the base class", () => {
    const { document } = render("text-input", { id: "n" });
    const el = document.querySelector("input");
    expect(el).toBeTruthy();
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains("text-input")).toBe(true);
  });

  it("sets id and defaults name to id", () => {
    const { document } = render("text-input", { id: "name" });
    const el = document.querySelector("input");
    expect(el.getAttribute("id")).toBe("name");
    expect(el.getAttribute("name")).toBe("name");
  });

  it("respects an explicit name", () => {
    const { document } = render("text-input", { id: "x", name: "firstName" });
    expect(document.querySelector("input").getAttribute("name")).toBe("firstName");
  });

  it("renders value='' by default", () => {
    const { document } = render("text-input", { id: "x" });
    expect(document.querySelector("input").getAttribute("value")).toBe("");
  });

  it("renders params.value", () => {
    const { document } = render("text-input", { id: "x", value: "Jane" });
    expect(document.querySelector("input").getAttribute("value")).toBe("Jane");
  });

  it("sets aria-describedby and aria-errormessage and aria-invalid", () => {
    const { document } = render("text-input", {
      id: "x",
      describedBy: "x-hint x-error",
      errormessage: "x-error",
      invalid: true,
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-describedby")).toBe("x-hint x-error");
    expect(el.getAttribute("aria-errormessage")).toBe("x-error");
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("renders required, disabled, readonly booleans", () => {
    const { document } = render("text-input", {
      id: "x",
      required: true,
      disabled: true,
      readonly: true,
    });
    const el = document.querySelector("input");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.hasAttribute("readonly")).toBe(true);
  });

  it("renders placeholder, autocomplete, pattern, min/maxlength, inputmode", () => {
    const { document } = render("text-input", {
      id: "x",
      placeholder: "Jane",
      autocomplete: "name",
      pattern: "[A-Za-z]+",
      minlength: 1,
      maxlength: 50,
      inputmode: "text",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("placeholder")).toBe("Jane");
    expect(el.getAttribute("autocomplete")).toBe("name");
    expect(el.getAttribute("pattern")).toBe("[A-Za-z]+");
    expect(el.getAttribute("minlength")).toBe("1");
    expect(el.getAttribute("maxlength")).toBe("50");
    expect(el.getAttribute("inputmode")).toBe("text");
  });

  it("appends params.classes", () => {
    const { document } = render("text-input", { id: "x", classes: "wide" });
    expect(document.querySelector("input.text-input.wide")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("text-input", {
      id: "x",
      attributes: { "data-field": "primary" },
    });
    expect(document.querySelector("input").getAttribute("data-field"))
      .toBe("primary");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("text-input", { id: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
