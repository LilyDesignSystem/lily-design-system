import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("character", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("character", { text: "A" });
    expect(document.querySelector("span.character")).toBeTruthy();
  });

  it("sets aria-hidden when decorative", () => {
    const { document } = render("character", {
      text: "◆",
      decorative: true,
    });
    const el = document.querySelector("span.character");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("sets aria-label when provided", () => {
    const { document } = render("character", {
      text: "€",
      label: "Euro sign",
    });
    expect(document.querySelector("span.character").getAttribute("aria-label"))
      .toBe("Euro sign");
  });

  it("ignores label when decorative is true", () => {
    const { document } = render("character", {
      text: "x",
      decorative: true,
      label: "ignored",
    });
    const el = document.querySelector("span.character");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("escapes params.text", () => {
    const { document } = render("character", { text: "<X>" });
    expect(document.querySelector("span.character").textContent.trim())
      .toBe("<X>");
  });

  it("appends params.classes", () => {
    const { document } = render("character", { text: "A", classes: "large" });
    expect(document.querySelector("span.character.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("character", { text: "A" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
