import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tool-bar-button", () => {
  it("renders a <button> with the base class", () => {
    const { document } = render("tool-bar-button", { text: "Bold" });
    expect(document.querySelector("button.tool-bar-button")).toBeTruthy();
  });

  it("sets aria-pressed when pressed is provided", () => {
    const { document } = render("tool-bar-button", {
      text: "x",
      pressed: true,
    });
    expect(document.querySelector("button").getAttribute("aria-pressed"))
      .toBe("true");
  });

  it("supports disabled", () => {
    const { document } = render("tool-bar-button", { text: "x", disabled: true });
    expect(document.querySelector("button").hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tool-bar-button", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
