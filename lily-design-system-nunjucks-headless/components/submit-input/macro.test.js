import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("submit-input", () => {
  it("renders an <input type=submit> with the base class", () => {
    const { document } = render("submit-input", {});
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("submit");
    expect(el.classList.contains("submit-input")).toBe(true);
  });

  it("defaults value to 'Submit'", () => {
    const { document } = render("submit-input", {});
    expect(document.querySelector("input").getAttribute("value")).toBe("Submit");
  });

  it("respects a custom value", () => {
    const { document } = render("submit-input", {
      value: "Save and continue",
    });
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("Save and continue");
  });

  it("sets id and name when provided", () => {
    const { document } = render("submit-input", {
      id: "save",
      name: "action",
      value: "Save",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("id")).toBe("save");
    expect(el.getAttribute("name")).toBe("action");
  });

  it("supports disabled", () => {
    const { document } = render("submit-input", { disabled: true });
    expect(document.querySelector("input").hasAttribute("disabled")).toBe(true);
  });

  it("renders formaction and formmethod overrides", () => {
    const { document } = render("submit-input", {
      value: "Save draft",
      formaction: "/draft",
      formmethod: "post",
      formnovalidate: true,
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("formaction")).toBe("/draft");
    expect(el.getAttribute("formmethod")).toBe("post");
    expect(el.hasAttribute("formnovalidate")).toBe(true);
  });

  it("sets aria-label when provided", () => {
    const { document } = render("submit-input", {
      value: "→",
      label: "Submit the form",
    });
    expect(document.querySelector("input").getAttribute("aria-label"))
      .toBe("Submit the form");
  });

  it("appends params.classes", () => {
    const { document } = render("submit-input", { classes: "primary" });
    expect(document.querySelector("input.submit-input.primary")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("submit-input", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
