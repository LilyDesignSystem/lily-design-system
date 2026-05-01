import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("section-link", () => {
  it("renders a <a> with the base class", () => {
    const { document } = render("section-link", { label: "Test", text: "Content" });
    const el = document.querySelector(".section-link");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("section-link", { label: "Test", classes: "extra" });
    const el = document.querySelector(".section-link.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("section-link", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
