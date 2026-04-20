import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tab-bar", () => {
  it("renders a <div role=tablist> with the base class", () => {
    const { document } = render("tab-bar", { label: "X" });
    const el = document.querySelector("div.tab-bar");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("tablist");
    expect(el.getAttribute("aria-label")).toBe("X");
  });

  it("prefers labelledBy over label", () => {
    const { document } = render("tab-bar", { label: "x", labelledBy: "h" });
    const el = document.querySelector("div.tab-bar");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render("tab-bar", { label: "x" }, '<span class="child"></span>');
    expect(document.querySelector("div.tab-bar .child")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tab-bar", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
