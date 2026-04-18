import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("action-link", () => {
  it("renders an <a> with the base class", () => {
    const { document } = render("action-link", {
      href: "/book",
      text: "Book",
    });
    const el = document.querySelector("a");
    expect(el).toBeTruthy();
    expect(el.classList.contains("action-link")).toBe(true);
  });

  it("sets href from params.href", () => {
    const { document } = render("action-link", { href: "/book", text: "x" });
    expect(document.querySelector("a").getAttribute("href")).toBe("/book");
  });

  it("uses params.text as content", () => {
    const { document } = render("action-link", {
      href: "/",
      text: "Find your NHS number",
    });
    expect(document.querySelector("a").textContent.trim())
      .toBe("Find your NHS number");
  });

  it("renders params.html raw", () => {
    const { document } = render("action-link", {
      href: "/",
      html: "<strong>Book</strong> now",
    });
    expect(document.querySelector("a strong")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("action-link", {
      href: "/",
      text: "x",
      classes: "action-link-primary",
    });
    expect(document.querySelector("a.action-link.action-link-primary")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("action-link", {
      href: "/",
      text: "Book",
      label: "Book an appointment",
    });
    expect(document.querySelector("a").getAttribute("aria-label"))
      .toBe("Book an appointment");
  });

  it("renders params.attributes", () => {
    const { document } = render("action-link", {
      href: "/",
      text: "x",
      attributes: { rel: "nofollow" },
    });
    expect(document.querySelector("a").getAttribute("rel")).toBe("nofollow");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("action-link", { href: "/", text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
