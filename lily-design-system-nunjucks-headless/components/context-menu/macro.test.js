import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("context-menu", () => {
  it("renders a <ul role=menu> with the base class", () => {
    const { document } = render("context-menu", { label: "X" });
    const el = document.querySelector("ul.context-menu");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("menu");
    expect(el.getAttribute("aria-label")).toBe("X");
  });

  it("defaults aria-label to 'Context menu'", () => {
    const { document } = render("context-menu", {});
    expect(document.querySelector("ul.context-menu").getAttribute("aria-label")).toBe("Context menu");
  });

  it("prefers labelledBy over label", () => {
    const { document } = render("context-menu", { label: "x", labelledBy: "h" });
    const el = document.querySelector("ul.context-menu");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render("context-menu", { label: "x" }, '<span class="child"></span>');
    expect(document.querySelector("ul.context-menu .child")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("context-menu", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
