import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("toast", () => {
  it("renders a <div role=status> hidden by default", () => {
    const { document } = render("toast", { label: "X" });
    const el = document.querySelector("div.toast");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("status");
    expect(el.hasAttribute("hidden")).toBe(true);
  });

  it("is not hidden when open", () => {
    const { document } = render("toast", { label: "X", open: true });
    expect(document.querySelector("div").hasAttribute("hidden")).toBe(false);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("toast", { label: "X" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
