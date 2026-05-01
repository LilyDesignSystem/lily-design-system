import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("phase-banner", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("phase-banner", { label: "Test", text: "Content" });
    const el = document.querySelector(".phase-banner");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("phase-banner", { label: "Test", classes: "extra" });
    const el = document.querySelector(".phase-banner.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("phase-banner", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
