import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("screen-reader-span", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("screen-reader-span", { text: "Hidden" });
    const el = document.querySelector("span.screen-reader-span");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("Hidden");
  });

  it("escapes text", () => {
    const { document } = render("screen-reader-span", { text: "A & B" });
    expect(document.querySelector("span").textContent.trim()).toBe("A & B");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("screen-reader-span", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
