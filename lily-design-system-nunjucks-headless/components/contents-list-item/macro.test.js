import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("contents-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("contents-list-item", { text: "Intro" });
    expect(document.querySelector("li.contents-list-item")).toBeTruthy();
  });

  it("escapes text", () => {
    const { document } = render("contents-list-item", { text: "A & B" });
    expect(document.querySelector("li").textContent.trim()).toBe("A & B");
  });

  it("renders html raw", () => {
    const { document } = render("contents-list-item", {
      html: '<a href="#s1">Section 1</a>',
    });
    expect(document.querySelector("li a").textContent).toBe("Section 1");
  });

  it("sets aria-current='location' when current is true", () => {
    const { document } = render("contents-list-item", {
      text: "Here",
      current: true,
    });
    expect(document.querySelector("li").getAttribute("aria-current"))
      .toBe("location");
  });

  it("omits aria-current when current is falsy", () => {
    const { document } = render("contents-list-item", { text: "x" });
    expect(document.querySelector("li").hasAttribute("aria-current")).toBe(false);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("contents-list-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
