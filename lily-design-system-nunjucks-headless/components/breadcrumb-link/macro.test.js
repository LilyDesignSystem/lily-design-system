import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("breadcrumb-link", () => {
  it("renders an <a> with the base class", () => {
    const { document } = render("breadcrumb-link", {
      href: "/",
      text: "Home",
    });
    const el = document.querySelector("a");
    expect(el).toBeTruthy();
    expect(el.classList.contains("breadcrumb-link")).toBe(true);
  });

  it("sets href from params.href", () => {
    const { document } = render("breadcrumb-link", {
      href: "/services/",
      text: "x",
    });
    expect(document.querySelector("a").getAttribute("href")).toBe("/services/");
  });

  it("defaults href to '#' when omitted", () => {
    const { document } = render("breadcrumb-link", { text: "x" });
    expect(document.querySelector("a").getAttribute("href")).toBe("#");
  });

  it("escapes params.text", () => {
    const { document } = render("breadcrumb-link", {
      href: "/",
      text: "A & B",
    });
    expect(document.querySelector("a").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("breadcrumb-link", {
      href: "/",
      html: "<span>Home</span>",
    });
    expect(document.querySelector("a span").textContent).toBe("Home");
  });

  it("appends params.classes", () => {
    const { document } = render("breadcrumb-link", {
      href: "/",
      text: "x",
      classes: "extra",
    });
    expect(document.querySelector("a.breadcrumb-link.extra")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("breadcrumb-link", {
      href: "/",
      text: "x",
      label: "Home page",
    });
    expect(document.querySelector("a").getAttribute("aria-label"))
      .toBe("Home page");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("breadcrumb-link", { href: "/", text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
