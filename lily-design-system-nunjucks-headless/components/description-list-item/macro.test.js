import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("description-list-item", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("description-list-item", { label: "Test", text: "Content" });
    const el = document.querySelector(".description-list-item");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("description-list-item", { label: "Test", classes: "extra" });
    const el = document.querySelector(".description-list-item.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("description-list-item", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
