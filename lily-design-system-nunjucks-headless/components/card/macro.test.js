import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("card", () => {
  it("renders a <div> with the base class when no label is given", () => {
    const { document } = render("card", { text: "Body" });
    const el = document.querySelector("div.card");
    expect(el).toBeTruthy();
    expect(document.querySelector("section.card")).toBeNull();
  });

  it("upgrades to a <section> when params.label is provided", () => {
    const { document } = render("card", { text: "Body", label: "Summary card" });
    const el = document.querySelector("section.card");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Summary card");
  });

  it("upgrades to a <section> when params.labelledBy is provided", () => {
    const { document } = render("card", {
      html: '<h3 id="h">Heading</h3>',
      labelledBy: "h",
    });
    const el = document.querySelector("section.card");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-labelledby")).toBe("h");
  });

  it("prefers labelledBy over label when both are set", () => {
    const { document } = render("card", {
      text: "x",
      label: "Fallback",
      labelledBy: "h",
    });
    const el = document.querySelector("section.card");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("escapes params.text", () => {
    const { document } = render("card", { text: "A & B" });
    expect(document.querySelector("div.card").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("card", { html: "<p>Hello</p>" });
    expect(document.querySelector("div.card p")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("card", { text: "x", classes: "card-feature" });
    expect(document.querySelector("div.card.card-feature")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("card", {
      text: "x",
      attributes: { "data-kind": "patient" },
    });
    expect(document.querySelector("div.card").getAttribute("data-kind")).toBe("patient");
  });

  it("renders caller block content", () => {
    const { document } = render("card", {}, "<p>Content</p>");
    expect(document.querySelector("div.card p").textContent).toBe("Content");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("card", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
