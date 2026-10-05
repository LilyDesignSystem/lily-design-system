import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const p = { moreLabel: "Show more", lessLabel: "Show less", id: "c1", text: "Long content" };
const r = (x = {}) => render("show-more", { ...p, ...x }).document;
describe("show-more", () => {
  it("renders root div.show-more with content and button", () => {
    const d = r();
    expect(d.querySelector("div.show-more")).toBeTruthy();
    expect(d.querySelector(".show-more-content").textContent.trim()).toBe("Long content");
    expect(d.querySelector("button.show-more-button").getAttribute("type")).toBe("button");
  });
  it("collapsed by default: aria-expanded=false, data-expanded=false, moreLabel", () => {
    const d = r();
    const b = d.querySelector("button");
    expect(b.getAttribute("aria-expanded")).toBe("false");
    expect(d.querySelector(".show-more-content").getAttribute("data-expanded")).toBe("false");
    expect(b.textContent.trim()).toBe("Show more");
  });
  it("expanded: aria-expanded=true, data-expanded=true, lessLabel", () => {
    const d = r({ expanded: true });
    const b = d.querySelector("button");
    expect(b.getAttribute("aria-expanded")).toBe("true");
    expect(d.querySelector(".show-more-content").getAttribute("data-expanded")).toBe("true");
    expect(b.textContent.trim()).toBe("Show less");
  });
  it("button aria-controls points at the content id", () => {
    const d = r();
    expect(d.querySelector("button").getAttribute("aria-controls")).toBe("c1");
    expect(d.querySelector(".show-more-content").getAttribute("id")).toBe("c1");
  });
  it("exposes both labels for consumer JS and the script hook", () => {
    const b = r().querySelector("button");
    expect(b.getAttribute("data-more-label")).toBe("Show more");
    expect(b.getAttribute("data-less-label")).toBe("Show less");
    expect(b.getAttribute("data-module")).toBe("show-more");
  });
  it("keeps content in the DOM and never hidden inline", () => {
    const { html } = render("show-more", p);
    expect(html).not.toContain("hidden");
    expect(html).not.toContain("style=");
  });
  it("renders caller content", () => {
    const { document } = render("show-more", { moreLabel: "m", lessLabel: "l" }, "<p>kid</p>");
    expect(document.querySelector(".show-more-content p")).toBeTruthy();
  });
  it("appends classes and spreads attributes on the root", () => {
    const el = r({ classes: "extra", attributes: { "data-x": "1" } }).querySelector(".show-more");
    expect(el.classList.contains("extra")).toBe(true);
    expect(el.getAttribute("data-x")).toBe("1");
  });
  it("contains no <style> or <script> tags", () => {
    const { html } = render("show-more", p);
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
