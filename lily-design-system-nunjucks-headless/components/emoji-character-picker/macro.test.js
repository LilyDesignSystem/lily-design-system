import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("emoji-character-picker", () => {
  it("renders a <div role=dialog> hidden by default", () => {
    const { document } = render("emoji-character-picker", {});
    const el = document.querySelector("div.emoji-character-picker");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.hasAttribute("hidden")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("emoji-character-picker", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
