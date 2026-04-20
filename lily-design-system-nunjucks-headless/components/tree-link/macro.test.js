import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tree-link", () => {
  it("renders an <a> with the base class and href", () => {
    const { document } = render("tree-link", { href: "/x", text: "X" });
    const el = document.querySelector("a.tree-link");
    expect(el).toBeTruthy();
    expect(el.getAttribute("href")).toBe("/x");
  });

  it("defaults href to '#'", () => {
    const { document } = render("tree-link", { text: "x" });
    expect(document.querySelector("a").getAttribute("href")).toBe("#");
  });

  it("sets aria-current='page' when current", () => {
    const { document } = render("tree-link", {
      href: "/",
      text: "x",
      current: true,
    });
    expect(document.querySelector("a").getAttribute("aria-current"))
      .toBe("page");
  });

  it("escapes text", () => {
    const { document } = render("tree-link", { text: "A & B" });
    expect(document.querySelector("a").textContent.trim()).toBe("A & B");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tree-link", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
