import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("announcement-banner", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("announcement-banner", { label: "Test", text: "Content" });
    const el = document.querySelector(".announcement-banner");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("announcement-banner", { label: "Test", classes: "extra" });
    const el = document.querySelector(".announcement-banner.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("announcement-banner", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
