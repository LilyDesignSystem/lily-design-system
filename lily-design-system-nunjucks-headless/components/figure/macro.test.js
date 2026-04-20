import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("figure", () => {
  it("renders a <figure> with caller content", () => {
    const { document } = render(
      "figure",
      {},
      '<img src="/x.jpg" alt="x">',
    );
    expect(document.querySelector("figure.figure img")).toBeTruthy();
  });

  it("renders a <figcaption> when caption is provided", () => {
    const { document } = render("figure", { caption: "A diagram" }, "<p/>");
    const c = document.querySelector("figcaption.figure-caption");
    expect(c).toBeTruthy();
    expect(c.textContent.trim()).toBe("A diagram");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("figure", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
