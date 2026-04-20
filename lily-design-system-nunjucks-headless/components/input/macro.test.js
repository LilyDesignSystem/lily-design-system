import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("input", () => {
  it("renders an <input> with defaults", () => {
    const { document } = render("input", {});
    const el = document.querySelector("input.input");
    expect(el).toBeTruthy();
    expect(el.getAttribute("type")).toBe("text");
  });

  it("respects type, value, required, disabled", () => {
    const { document } = render("input", {
      type: "email",
      value: "x@y.com",
      required: true,
      disabled: true,
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("email");
    expect(el.getAttribute("value")).toBe("x@y.com");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("input", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
