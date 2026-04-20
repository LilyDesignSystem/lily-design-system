import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("footer", () => {
  it("renders a <footer> with the base class", () => {
    const { document } = render("footer", {});
    expect(document.querySelector("footer.footer")).toBeTruthy();
  });

  it("respects params.label", () => {
    const { document } = render("footer", { label: "Page footer" });
    expect(document.querySelector("footer.footer").getAttribute("aria-label"))
      .toBe("Page footer");
  });

  it("renders caller content", () => {
    const { document } = render("footer", {}, "<p>©</p>");
    expect(document.querySelector("footer p").textContent).toBe("©");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("footer", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
