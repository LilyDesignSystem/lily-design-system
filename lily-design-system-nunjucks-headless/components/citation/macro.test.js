import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("citation", () => {
  it("renders a <cite> with the base class", () => {
    const { document } = render("citation", { text: "NICE guidelines" });
    const el = document.querySelector("cite.citation");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("NICE guidelines");
  });

  it("escapes text", () => {
    const { document } = render("citation", { text: "A & B" });
    expect(document.querySelector("cite").textContent.trim()).toBe("A & B");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("citation", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
