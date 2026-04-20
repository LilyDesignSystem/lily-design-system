import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("menu-bar-button", () => {
  it("renders a <button role=menuitem> with the base class", () => {
    const { document } = render("menu-bar-button", { text: "File" });
    const el = document.querySelector("button.menu-bar-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("menuitem");
  });

  it("sets aria-expanded when provided", () => {
    const { document: open } = render("menu-bar-button", {
      text: "x",
      expanded: true,
    });
    expect(open.querySelector("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("sets aria-controls when provided", () => {
    const { document } = render("menu-bar-button", {
      text: "x",
      controls: "file-menu",
    });
    expect(document.querySelector("button").getAttribute("aria-controls"))
      .toBe("file-menu");
  });

  it("escapes text", () => {
    const { document } = render("menu-bar-button", { text: "A & B" });
    expect(document.querySelector("button").textContent.trim()).toBe("A & B");
  });

  it("supports disabled", () => {
    const { document } = render("menu-bar-button", { text: "x", disabled: true });
    expect(document.querySelector("button").hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("menu-bar-button", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
