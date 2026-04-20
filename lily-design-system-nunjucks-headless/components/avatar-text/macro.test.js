import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("avatar-text", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("avatar-text", { text: "JS" });
    expect(document.querySelector("span.avatar-text")).toBeTruthy();
  });

  it("is aria-hidden by default (decorative inside an Avatar)", () => {
    const { document } = render("avatar-text", { text: "JS" });
    expect(document.querySelector("span.avatar-text").getAttribute("aria-hidden"))
      .toBe("true");
  });

  it("exposes text when decorative=false", () => {
    const { document } = render("avatar-text", {
      text: "JS",
      decorative: false,
      label: "Jane Smith initials",
    });
    const el = document.querySelector("span.avatar-text");
    expect(el.hasAttribute("aria-hidden")).toBe(false);
    expect(el.getAttribute("aria-label")).toBe("Jane Smith initials");
  });

  it("escapes params.text", () => {
    const { document } = render("avatar-text", { text: "A & B" });
    expect(document.querySelector("span.avatar-text").textContent.trim())
      .toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("avatar-text", { html: "<em>J</em>" });
    expect(document.querySelector("span.avatar-text em")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("avatar-text", {
      text: "JS",
      classes: "large",
    });
    expect(document.querySelector("span.avatar-text.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("avatar-text", { text: "JS" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
