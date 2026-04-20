import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("dropdown-menu", () => {
  it("renders a <div role=menu> hidden by default", () => {
    const { document } = render("dropdown-menu", { label: "X" });
    const el = document.querySelector("div.dropdown-menu");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("menu");
    expect(el.hasAttribute("hidden")).toBe(true);
  });

  it("is not hidden when open", () => {
    const { document } = render("dropdown-menu", { label: "X", open: true });
    expect(document.querySelector("div").hasAttribute("hidden")).toBe(false);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("dropdown-menu", { label: "X" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
