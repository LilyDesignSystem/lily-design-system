import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("clamp-text", () => {
  it("renders a <div> with the base class and default lines", () => {
    const { document } = render("clamp-text", { text: "Hello" });
    const el = document.querySelector("div.clamp-text");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-lines")).toBe("2");
    expect(el.getAttribute("style")).toContain("--clamp-text-lines: 2");
  });

  it("respects a custom lines value", () => {
    const { document } = render("clamp-text", { text: "x", lines: 5 });
    const el = document.querySelector("div.clamp-text");
    expect(el.getAttribute("data-lines")).toBe("5");
    expect(el.getAttribute("style")).toContain("--clamp-text-lines: 5");
  });

  it("escapes params.text", () => {
    const { document } = render("clamp-text", { text: "A & B" });
    expect(document.querySelector("div.clamp-text").textContent.trim())
      .toBe("A & B");
  });

  it("renders params.html as raw HTML", () => {
    const { document } = render("clamp-text", { html: "<p>Hi</p>" });
    expect(document.querySelector("div.clamp-text p")).toBeTruthy();
  });

  it("renders params.label as aria-label", () => {
    const { document } = render("clamp-text", { text: "x", label: "Bio" });
    expect(document.querySelector("div.clamp-text").getAttribute("aria-label"))
      .toBe("Bio");
  });

  it("appends params.classes", () => {
    const { document } = render("clamp-text", { text: "x", classes: "extra" });
    expect(document.querySelector("div.clamp-text.extra")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render("clamp-text", {}, "<em>Body</em>");
    expect(document.querySelector("div.clamp-text em")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("clamp-text", {
      text: "x",
      attributes: { "data-test": "abc" },
    });
    expect(document.querySelector("div.clamp-text").getAttribute("data-test"))
      .toBe("abc");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("clamp-text", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
