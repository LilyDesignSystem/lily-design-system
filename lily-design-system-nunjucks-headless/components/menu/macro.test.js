import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("menu", () => {
  it("renders a <ul role=menu> with the base class", () => {
    const { document } = render("menu", { label: "X" });
    const el = document.querySelector("ul.menu");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("menu");
    expect(el.getAttribute("aria-label")).toBe("X");
  });

  it("defaults aria-label to 'Menu'", () => {
    const { document } = render("menu", {});
    expect(document.querySelector("ul.menu").getAttribute("aria-label")).toBe("Menu");
  });

  it("prefers labelledBy over label", () => {
    const { document } = render("menu", { label: "x", labelledBy: "h" });
    const el = document.querySelector("ul.menu");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render("menu", { label: "x" }, '<span class="child"></span>');
    expect(document.querySelector("ul.menu .child")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("menu", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
