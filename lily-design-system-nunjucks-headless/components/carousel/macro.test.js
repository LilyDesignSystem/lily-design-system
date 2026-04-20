import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("carousel", () => {
  it("renders a <section role=region> with aria-roledescription=carousel", () => {
    const { document } = render("carousel", { label: "Top stories" });
    const el = document.querySelector("section.carousel");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-roledescription")).toBe("carousel");
    expect(el.getAttribute("aria-label")).toBe("Top stories");
  });

  it("renders caller content in the slides container", () => {
    const { document } = render(
      "carousel",
      { label: "x" },
      '<article class="slide">1</article>',
    );
    expect(document.querySelector(".carousel-slides .slide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("carousel", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
