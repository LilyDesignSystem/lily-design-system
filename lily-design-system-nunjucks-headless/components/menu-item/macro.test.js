import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("menu-item", () => {
  it("renders an <li> wrapping a <button role=menuitem>", () => {
    const { document } = render("menu-item", { text: "Save" });
    const li = document.querySelector("li.menu-item");
    expect(li).toBeTruthy();
    expect(li.getAttribute("role")).toBe("none");
    const btn = li.querySelector("button.menu-item-button");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("role")).toBe("menuitem");
  });

  it("escapes text", () => {
    const { document } = render("menu-item", { text: "A & B" });
    expect(document.querySelector(".menu-item-text").textContent.trim())
      .toBe("A & B");
  });

  it("renders html raw", () => {
    const { document } = render("menu-item", { html: "<strong>S</strong>" });
    expect(document.querySelector(".menu-item-text strong").textContent).toBe("S");
  });

  it("renders a keyboard shortcut when provided", () => {
    const { document } = render("menu-item", {
      text: "Save",
      shortcut: "Ctrl+S",
    });
    expect(document.querySelector("kbd.menu-item-shortcut").textContent.trim())
      .toBe("Ctrl+S");
  });

  it("supports disabled", () => {
    const { document } = render("menu-item", { text: "x", disabled: true });
    expect(document.querySelector("button").hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("menu-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
