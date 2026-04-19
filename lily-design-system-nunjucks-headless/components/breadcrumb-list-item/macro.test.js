import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("breadcrumb-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("breadcrumb-list-item", { text: "Home" });
    const el = document.querySelector("li");
    expect(el).toBeTruthy();
    expect(el.classList.contains("breadcrumb-list-item")).toBe(true);
  });

  it("escapes params.text", () => {
    const { document } = render("breadcrumb-list-item", { text: "A & B" });
    expect(document.querySelector("li").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("breadcrumb-list-item", {
      html: '<a href="/">Home</a>',
    });
    expect(document.querySelector("li a")).toBeTruthy();
  });

  it("sets aria-current='page' when params.current is true", () => {
    const { document } = render("breadcrumb-list-item", {
      text: "Today",
      current: true,
    });
    expect(document.querySelector("li").getAttribute("aria-current"))
      .toBe("page");
  });

  it("omits aria-current when params.current is falsy", () => {
    const { document } = render("breadcrumb-list-item", { text: "x" });
    expect(document.querySelector("li").hasAttribute("aria-current")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("breadcrumb-list-item", {
      text: "x",
      classes: "sub",
    });
    expect(document.querySelector("li.breadcrumb-list-item.sub")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "breadcrumb-list-item",
      {},
      '<a href="/">Home</a>',
    );
    expect(document.querySelector("li a").textContent).toBe("Home");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("breadcrumb-list-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
