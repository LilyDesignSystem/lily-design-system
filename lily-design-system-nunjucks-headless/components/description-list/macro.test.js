import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("description-list", () => {
  it("renders a <dl> with the base class", () => {
    const { document } = render("description-list", { label: "Test", text: "Content" });
    const el = document.querySelector(".description-list");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("description-list", { label: "Test", classes: "extra" });
    const el = document.querySelector(".description-list.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("description-list", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
