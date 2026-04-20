import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("menu-bar", () => {
  it("renders a <div role=menubar> with the base class", () => {
    const { document } = render("menu-bar", { label: "X" });
    const el = document.querySelector("div.menu-bar");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("menubar");
    expect(el.getAttribute("aria-label")).toBe("X");
  });

  it("defaults aria-label to 'Menu bar'", () => {
    const { document } = render("menu-bar", {});
    expect(document.querySelector("div.menu-bar").getAttribute("aria-label")).toBe("Menu bar");
  });

  it("prefers labelledBy over label", () => {
    const { document } = render("menu-bar", { label: "x", labelledBy: "h" });
    const el = document.querySelector("div.menu-bar");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render("menu-bar", { label: "x" }, '<span class="child"></span>');
    expect(document.querySelector("div.menu-bar .child")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("menu-bar", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
