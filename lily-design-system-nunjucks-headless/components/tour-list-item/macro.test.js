import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tour-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("tour-list-item", { text: "Step 1" });
    expect(document.querySelector("li.tour-list-item")).toBeTruthy();
  });

  it("sets data-current when current", () => {
    const { document } = render("tour-list-item", {
      text: "x",
      current: true,
    });
    expect(document.querySelector("li").hasAttribute("data-current")).toBe(true);
  });

  it("omits data-current when current is falsy", () => {
    const { document } = render("tour-list-item", { text: "x" });
    expect(document.querySelector("li").hasAttribute("data-current")).toBe(false);
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
