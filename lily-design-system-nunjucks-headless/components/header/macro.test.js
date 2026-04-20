import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("header", () => {
  it("renders a <header> with the base class", () => {
    const { document } = render("header", {});
    expect(document.querySelector("header.header")).toBeTruthy();
  });

  it("respects params.label", () => {
    const { document } = render("header", { label: "Site header" });
    expect(document.querySelector("header").getAttribute("aria-label"))
      .toBe("Site header");
  });

  it("renders caller content", () => {
    const { document } = render("header", {}, "<h1>X</h1>");
    expect(document.querySelector("header h1").textContent).toBe("X");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("header", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
