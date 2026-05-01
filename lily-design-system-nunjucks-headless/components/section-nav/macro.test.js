import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("section-nav", () => {
  it("renders a <nav> with the base class", () => {
    const { document } = render("section-nav", { label: "Test", text: "Content" });
    const el = document.querySelector(".section-nav");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("section-nav", { label: "Test", classes: "extra" });
    const el = document.querySelector(".section-nav.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("section-nav", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
