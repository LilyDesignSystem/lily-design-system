import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("context-menu-item", () => {
  it("renders an <li> wrapping a <button role=menuitem>", () => {
    const { document } = render("context-menu-item", { text: "Copy" });
    const li = document.querySelector("li.context-menu-item");
    expect(li).toBeTruthy();
    expect(li.getAttribute("role")).toBe("none");
    const btn = li.querySelector("button.context-menu-item-button");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("role")).toBe("menuitem");
  });

  it("renders shortcut when provided", () => {
    const { document } = render("context-menu-item", {
      text: "Copy",
      shortcut: "Ctrl+C",
    });
    expect(document.querySelector("kbd.context-menu-item-shortcut").textContent.trim())
      .toBe("Ctrl+C");
  });

  it("sets data-danger when danger is true", () => {
    const { document } = render("context-menu-item", {
      text: "Delete",
      danger: true,
    });
    expect(document.querySelector("li").getAttribute("data-danger")).toBe("true");
  });

  it("supports disabled", () => {
    const { document } = render("context-menu-item", {
      text: "x",
      disabled: true,
    });
    expect(document.querySelector("button").hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("context-menu-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
