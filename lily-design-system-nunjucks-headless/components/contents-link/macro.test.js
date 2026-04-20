import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("contents-link", () => {
  it("renders an <a> with the base class and href", () => {
    const { document } = render("contents-link", { href: "#s1", text: "Intro" });
    const el = document.querySelector("a.contents-link");
    expect(el).toBeTruthy();
    expect(el.getAttribute("href")).toBe("#s1");
  });

  it("defaults href to '#'", () => {
    const { document } = render("contents-link", { text: "x" });
    expect(document.querySelector("a").getAttribute("href")).toBe("#");
  });

  it("sets aria-current='location' when current is true", () => {
    const { document } = render("contents-link", {
      href: "/",
      text: "x",
      current: true,
    });
    expect(document.querySelector("a").getAttribute("aria-current"))
      .toBe("location");
  });

  it("escapes text", () => {
    const { document } = render("contents-link", { text: "A & B" });
    expect(document.querySelector("a").textContent.trim()).toBe("A & B");
  });

  it("renders html raw", () => {
    const { document } = render("contents-link", {
      html: "<em>Hi</em>",
    });
    expect(document.querySelector("a em").textContent).toBe("Hi");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("contents-link", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
