import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("status-tag", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("status-tag", { label: "Test", text: "Content" });
    const el = document.querySelector(".status-tag");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("status-tag", { label: "Test", classes: "extra" });
    const el = document.querySelector(".status-tag.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("status-tag", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
