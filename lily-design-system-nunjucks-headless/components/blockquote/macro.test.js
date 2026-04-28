import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("blockquote", () => {
  it("renders a <blockquote> with the base class", () => {
    const { document } = render("blockquote", { text: "Quote." });
    const el = document.querySelector("blockquote.blockquote");
    expect(el).toBeTruthy();
  });

  it("renders escaped text content", () => {
    const { document } = render("blockquote", { text: "Hello world" });
    expect(document.querySelector("blockquote").textContent.trim())
      .toBe("Hello world");
  });

  it("renders raw html content", () => {
    const { document } = render("blockquote", { html: "<p>Hi</p>" });
    expect(document.querySelector("blockquote p").textContent).toBe("Hi");
  });

  it("renders the cite attribute when provided", () => {
    const { document } = render("blockquote", {
      text: "Quote.",
      cite: "https://example.com/source",
    });
    expect(document.querySelector("blockquote").getAttribute("cite"))
      .toBe("https://example.com/source");
  });

  it("omits the cite attribute when not provided", () => {
    const { document } = render("blockquote", { text: "Quote." });
    expect(document.querySelector("blockquote").hasAttribute("cite"))
      .toBe(false);
  });

  it("renders a citation footer when citationText is provided", () => {
    const { document } = render("blockquote", {
      text: "Quote.",
      citationText: "— Author",
    });
    const footer = document.querySelector("blockquote footer.blockquote-citation");
    expect(footer).toBeTruthy();
    expect(footer.textContent).toBe("— Author");
  });

  it("omits the citation footer when citationText is missing", () => {
    const { document } = render("blockquote", { text: "Quote." });
    expect(document.querySelector("blockquote footer")).toBeFalsy();
  });

  it("renders aria-label when provided", () => {
    const { document } = render("blockquote", {
      text: "Quote.",
      label: "Famous quotation",
    });
    expect(document.querySelector("blockquote").getAttribute("aria-label"))
      .toBe("Famous quotation");
  });

  it("renders caller block content", () => {
    const { document } = render(
      "blockquote",
      {},
      "<p>Block content</p>",
    );
    expect(document.querySelector("blockquote p").textContent)
      .toBe("Block content");
  });

  it("appends params.classes", () => {
    const { document } = render("blockquote", {
      text: "Quote.",
      classes: "highlight",
    });
    expect(document.querySelector("blockquote.blockquote.highlight"))
      .toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("blockquote", {
      text: "Quote.",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("blockquote").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("blockquote", { text: "Quote." });
    expect(html).not.toContain("<style");
  });
});
