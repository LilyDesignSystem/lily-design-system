import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("hover-card", () => {
  it("renders a <div role=tooltip> hidden by default", () => {
    const { document } = render("hover-card", { label: "X" });
    const el = document.querySelector("div.hover-card");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("tooltip");
    expect(el.hasAttribute("hidden")).toBe(true);
  });

  it("is not hidden when open", () => {
    const { document } = render("hover-card", { label: "X", open: true });
    expect(document.querySelector("div").hasAttribute("hidden")).toBe(false);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("hover-card", { label: "X" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
