import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("color-picker", () => {
  it("renders a <div role=radiogroup>", () => {
    const { document } = render("color-picker", { label: "Colour" });
    const el = document.querySelector("div.color-picker");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
    expect(el.getAttribute("aria-label")).toBe("Colour");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("color-picker", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
