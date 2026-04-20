import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tool-bar", () => {
  it("renders a <div role=toolbar> with the base class", () => {
    const { document } = render("tool-bar", { label: "X" });
    const el = document.querySelector("div.tool-bar");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("toolbar");
    expect(el.getAttribute("aria-label")).toBe("X");
  });

  it("defaults aria-label to 'Tool bar'", () => {
    const { document } = render("tool-bar", {});
    expect(document.querySelector("div.tool-bar").getAttribute("aria-label")).toBe("Tool bar");
  });

  it("prefers labelledBy over label", () => {
    const { document } = render("tool-bar", { label: "x", labelledBy: "h" });
    const el = document.querySelector("div.tool-bar");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render("tool-bar", { label: "x" }, '<span class="child"></span>');
    expect(document.querySelector("div.tool-bar .child")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tool-bar", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
