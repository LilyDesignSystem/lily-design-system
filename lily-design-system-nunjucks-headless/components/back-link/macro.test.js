import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("back-link", () => {
  it("renders an <a> with the base class", () => {
    const { document } = render("back-link", { href: "/", text: "Back" });
    const el = document.querySelector("a");
    expect(el).toBeTruthy();
    expect(el.classList.contains("back-link")).toBe(true);
  });

  it("sets href from params.href", () => {
    const { document } = render("back-link", { href: "/services/" });
    expect(document.querySelector("a").getAttribute("href")).toBe("/services/");
  });

  it("defaults href to '#' when omitted", () => {
    const { document } = render("back-link", {});
    expect(document.querySelector("a").getAttribute("href")).toBe("#");
  });

  it("defaults text to 'Back' when no content is given", () => {
    const { document } = render("back-link", { href: "/" });
    expect(document.querySelector("a").textContent.trim()).toBe("Back");
  });

  it("uses params.text when provided", () => {
    const { document } = render("back-link", {
      href: "/",
      text: "Back to services",
    });
    expect(document.querySelector("a").textContent.trim()).toBe("Back to services");
  });

  it("renders params.html raw when provided", () => {
    const { document } = render("back-link", {
      href: "/",
      html: "<span>Back to services</span>",
    });
    expect(document.querySelector("a span").textContent).toBe("Back to services");
  });

  it("appends params.classes", () => {
    const { document } = render("back-link", {
      href: "/",
      text: "x",
      classes: "extra",
    });
    expect(document.querySelector("a.back-link.extra")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("back-link", {
      href: "/",
      text: "x",
      label: "Back to previous page",
    });
    expect(document.querySelector("a").getAttribute("aria-label"))
      .toBe("Back to previous page");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("back-link", { href: "/", text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
