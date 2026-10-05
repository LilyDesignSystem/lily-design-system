import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("empty-state", () => {
  it("renders a <div> root with the base class", () => {
    const el = render("empty-state", { text: "Nothing" }).document.querySelector(".empty-state");
    expect(el.tagName).toBe("DIV");
    expect(el.textContent.trim()).toBe("Nothing");
  });
  it("adds role=group and aria-label only when label is given", () => {
    const el = render("empty-state", { label: "No results", text: "x" }).document.querySelector(".empty-state");
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-label")).toBe("No results");
    const bare = render("empty-state", { text: "x" }).document.querySelector(".empty-state");
    expect(bare.hasAttribute("role")).toBe(false);
    expect(bare.hasAttribute("aria-label")).toBe(false);
  });
  it("renders free caller children (heading, text, action)", () => {
    const { document } = render("empty-state", {}, "<h2>Title</h2><p>Body</p><button>Go</button>");
    expect(document.querySelector(".empty-state h2").textContent).toBe("Title");
    expect(document.querySelector(".empty-state button")).toBeTruthy();
  });
  it("renders html raw", () => {
    const { document } = render("empty-state", { html: "<b>x</b>" });
    expect(document.querySelector(".empty-state b")).toBeTruthy();
  });
  it("appends classes and spreads attributes on the root", () => {
    const el = render("empty-state", { text: "x", classes: "extra", attributes: { "data-x": "1" } }).document.querySelector(".empty-state");
    expect(el.classList.contains("extra")).toBe(true);
    expect(el.getAttribute("data-x")).toBe("1");
  });
  it("contains no <style>, <script> or <svg>", () => {
    const { html } = render("empty-state", { text: "x" });
    expect(html).not.toMatch(/<(style|script|svg|img)/);
  });
});
