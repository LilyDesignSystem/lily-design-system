import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("contents-nav", () => {
  it("renders a <nav> with the base class and default aria-label", () => {
    const { document } = render("contents-nav", {});
    const el = document.querySelector("nav.contents-nav");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Contents");
  });

  it("respects params.label", () => {
    const { document } = render("contents-nav", { label: "On this page" });
    expect(document.querySelector("nav.contents-nav").getAttribute("aria-label"))
      .toBe("On this page");
  });

  it("prefers labelledBy over label", () => {
    const { document } = render("contents-nav", { label: "x", labelledBy: "h" });
    const el = document.querySelector("nav.contents-nav");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render(
      "contents-nav",
      {},
      '<ol class="contents-list"></ol>',
    );
    expect(document.querySelector("nav.contents-nav ol.contents-list")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("contents-nav", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
