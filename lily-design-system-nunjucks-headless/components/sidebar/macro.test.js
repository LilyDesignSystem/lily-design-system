import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("sidebar", () => {
  it("renders an <aside> with default aria-label", () => {
    const { document } = render("sidebar", {});
    const el = document.querySelector("aside.sidebar");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Sidebar");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("sidebar", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
