import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("file-dialog", () => {
  it("renders a <div role=dialog> hidden by default", () => {
    const { document } = render("file-dialog", { label: "X" });
    const el = document.querySelector("div.file-dialog");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.hasAttribute("hidden")).toBe(true);
  });

  it("is not hidden when open", () => {
    const { document } = render("file-dialog", { label: "X", open: true });
    expect(document.querySelector("div").hasAttribute("hidden")).toBe(false);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("file-dialog", { label: "X" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
