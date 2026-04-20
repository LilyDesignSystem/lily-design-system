import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("scroll-bar", () => {
  it("renders a <div role=scrollbar>", () => {
    const { document } = render("scroll-bar", { value: 25 });
    const el = document.querySelector("div.scroll-bar");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("scrollbar");
    expect(el.getAttribute("aria-valuenow")).toBe("25");
    expect(el.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("scroll-bar", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
