import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("accordion-link", () => {
  it("renders an <a> with the base class and href", () => {
    const { document } = render("accordion-link", { href: "/a", text: "A" });
    const el = document.querySelector("a.accordion-link");
    expect(el).toBeTruthy();
    expect(el.getAttribute("href")).toBe("/a");
    expect(el.textContent.trim()).toBe("A");
  });

  it("defaults href to '#'", () => {
    const { document } = render("accordion-link", { text: "A" });
    expect(document.querySelector("a.accordion-link").getAttribute("href"))
      .toBe("#");
  });

  it("escapes params.text", () => {
    const { document } = render("accordion-link", {
      href: "/",
      text: "A & B",
    });
    expect(document.querySelector("a").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("accordion-link", {
      href: "/",
      html: "<span>A</span>",
    });
    expect(document.querySelector("a span").textContent).toBe("A");
  });

  it("sets aria-current='page' when params.current is true", () => {
    const { document } = render("accordion-link", {
      href: "/",
      text: "A",
      current: true,
    });
    expect(document.querySelector("a").getAttribute("aria-current")).toBe("page");
  });

  it("appends params.classes", () => {
    const { document } = render("accordion-link", {
      href: "/",
      text: "A",
      classes: "sub",
    });
    expect(document.querySelector("a.accordion-link.sub")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("accordion-link", { href: "/", text: "A" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
