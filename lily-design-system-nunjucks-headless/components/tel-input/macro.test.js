import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tel-input", () => {
  it("renders an <input type=tel> with the base class", () => {
    const { document } = render("tel-input", { id: "t" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("tel");
    expect(el.classList.contains("tel-input")).toBe(true);
  });

  it("supports inputmode and autocomplete", () => {
    const { document } = render("tel-input", {
      id: "t",
      inputmode: "tel",
      autocomplete: "tel",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("inputmode")).toBe("tel");
    expect(el.getAttribute("autocomplete")).toBe("tel");
  });

  it("renders value", () => {
    const { document } = render("tel-input", {
      id: "t",
      value: "020 7946 0958",
    });
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("020 7946 0958");
  });

  it("sets aria-invalid", () => {
    const { document } = render("tel-input", { id: "t", invalid: true });
    expect(document.querySelector("input").getAttribute("aria-invalid"))
      .toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("tel-input", { id: "t", classes: "inline" });
    expect(document.querySelector("input.tel-input.inline")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tel-input", { id: "t" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
