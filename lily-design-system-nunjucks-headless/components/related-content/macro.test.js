import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("related-content", () => {
  it("renders a <aside> with the base class", () => {
    const { document } = render("related-content", { label: "Test", text: "Content" });
    const el = document.querySelector(".related-content");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("related-content", { label: "Test", classes: "extra" });
    const el = document.querySelector(".related-content.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("related-content", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
