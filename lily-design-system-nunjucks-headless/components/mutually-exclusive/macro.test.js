import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mutually-exclusive", () => {
  it("renders a <fieldset> with the base class", () => {
    const { document } = render("mutually-exclusive", { label: "Test", text: "Content" });
    const el = document.querySelector(".mutually-exclusive");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("mutually-exclusive", { label: "Test", classes: "extra" });
    const el = document.querySelector(".mutually-exclusive.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("mutually-exclusive", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
