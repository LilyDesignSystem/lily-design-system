import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tour-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("tour-list-item", { text: "Step 1" });
    expect(document.querySelector("li.tour-list-item")).toBeTruthy();
  });

  it("sets aria-current='step' when current", () => {
    const { document } = render("tour-list-item", {
      text: "x",
      current: true,
    });
    expect(document.querySelector("li").getAttribute("aria-current"))
      .toBe("step");
  });

  it("omits aria-current when current is falsy", () => {
    const { document } = render("tour-list-item", { text: "x" });
    expect(document.querySelector("li").hasAttribute("aria-current")).toBe(false);
  });

  it("escapes text", () => {
    const { document } = render("tour-list-item", { text: "A & B" });
    expect(document.querySelector("li").textContent.trim()).toBe("A & B");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tour-list-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
