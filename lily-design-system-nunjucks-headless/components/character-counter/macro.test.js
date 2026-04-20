import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("character-counter", () => {
  it("renders an <output aria-live=polite> with formatted text", () => {
    const { document } = render("character-counter", { value: 42, maximum: 100 });
    const el = document.querySelector("output.character-counter");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-live")).toBe("polite");
    expect(el.textContent.trim()).toBe("42 of 100 characters");
  });

  it("omits the maximum when none is provided", () => {
    const { document } = render("character-counter", { value: 5 });
    expect(document.querySelector("output").textContent.trim())
      .toBe("5 characters");
  });

  it("respects the 'for' attribute", () => {
    const { document } = render("character-counter", { value: 0, for: "msg" });
    expect(document.querySelector("output").getAttribute("for")).toBe("msg");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("character-counter", { value: 0 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
