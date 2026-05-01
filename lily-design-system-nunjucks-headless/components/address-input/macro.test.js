import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("address-input", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("address-input", { label: "Test", text: "Content" });
    const el = document.querySelector(".address-input");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("address-input", { label: "Test", classes: "extra" });
    const el = document.querySelector(".address-input.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("address-input", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
