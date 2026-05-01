import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("document-list", () => {
  it("renders a <ul> with the base class", () => {
    const { document } = render("document-list", { label: "Test", text: "Content" });
    const el = document.querySelector(".document-list");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("document-list", { label: "Test", classes: "extra" });
    const el = document.querySelector(".document-list.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("document-list", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
