import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("toggle-button", () => {
  it("renders a <button type=button> with the base class", () => {
    const { document } = render("toggle-button", { text: "Bold" });
    const el = document.querySelector("button.toggle-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("type")).toBe("button");
  });

  it("defaults aria-pressed to 'false'", () => {
    const { document } = render("toggle-button", { text: "Bold" });
    expect(document.querySelector("button.toggle-button").getAttribute("aria-pressed"))
      .toBe("false");
  });

  it("sets aria-pressed='true' when pressed", () => {
    const { document } = render("toggle-button", {
      text: "Bold",
      pressed: true,
    });
    expect(document.querySelector("button.toggle-button").getAttribute("aria-pressed"))
      .toBe("true");
  });

  it("supports disabled", () => {
    const { document } = render("toggle-button", {
      text: "Bold",
      disabled: true,
    });
    expect(document.querySelector("button.toggle-button").hasAttribute("disabled"))
      .toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("toggle-button", {
      text: "x",
      classes: "compact",
    });
    expect(document.querySelector("button.toggle-button.compact")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("toggle-button", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
