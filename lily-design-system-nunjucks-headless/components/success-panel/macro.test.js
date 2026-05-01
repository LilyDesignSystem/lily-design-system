import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("success-panel", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("success-panel", { label: "Test", text: "Content" });
    const el = document.querySelector(".success-panel");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("success-panel", { label: "Test", classes: "extra" });
    const el = document.querySelector(".success-panel.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("success-panel", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
