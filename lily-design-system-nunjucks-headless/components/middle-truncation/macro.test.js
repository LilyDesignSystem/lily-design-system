import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "middle-truncation";
const text = "quarterly-report-final-version-3.pdf";

describe("middleTruncation", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(name, { text, ellipsis: "…" });
    expect(document.querySelector("span.middle-truncation")).toBeTruthy();
  });

  it("puts the base class first, then the consumer class", () => {
    const { document } = render(name, { text, ellipsis: "…", classes: "mine" });
    expect(document.querySelector("span.middle-truncation").getAttribute("class")).toBe("middle-truncation mine");
  });

  it("renders the full text in both spans when nothing is shortened", () => {
    const { document } = render(name, { text, ellipsis: "…" });
    expect(document.querySelector(".middle-truncation-visual").textContent).toBe(text);
    expect(document.querySelector(".middle-truncation-full").textContent).toBe(text);
    expect(document.querySelector(".middle-truncation").hasAttribute("data-truncated")).toBe(false);
  });

  it("hides the visual copy from assistive technology and not the full text", () => {
    const { document } = render(name, { text, ellipsis: "…" });
    expect(document.querySelector(".middle-truncation-visual").getAttribute("aria-hidden")).toBe("true");
    const full = document.querySelector(".middle-truncation-full");
    expect(full.closest("[aria-hidden]")).toBeNull();
  });

  it("shows params.shortened in the visual span and marks data-truncated, keeping the full text", () => {
    const { document } = render(name, { text, ellipsis: "…", shortened: "quarterly-rep…ion-3.pdf" });
    expect(document.querySelector(".middle-truncation-visual").textContent).toBe("quarterly-rep…ion-3.pdf");
    expect(document.querySelector(".middle-truncation-full").textContent).toBe(text);
    expect(document.querySelector(".middle-truncation").hasAttribute("data-truncated")).toBe(true);
  });

  it("carries the options as data attributes for the browser script, with no default ellipsis", () => {
    const { document } = render(name, { text, ellipsis: "[...]", strategy: "fixed-end", end: 4 });
    const root = document.querySelector(".middle-truncation");
    expect(root.getAttribute("data-ellipsis")).toBe("[...]");
    expect(root.getAttribute("data-strategy")).toBe("fixed-end");
    expect(root.getAttribute("data-end")).toBe("4");
  });

  it("defaults the strategy to even and omits data-end when no end is given", () => {
    const { document } = render(name, { text, ellipsis: "…" });
    const root = document.querySelector(".middle-truncation");
    expect(root.getAttribute("data-strategy")).toBe("even");
    expect(root.hasAttribute("data-end")).toBe(false);
  });

  it("escapes the text", () => {
    const { document } = render(name, { text: "<b>x</b>", ellipsis: "…" });
    expect(document.querySelector(".middle-truncation-full").textContent).toBe("<b>x</b>");
    expect(document.querySelector(".middle-truncation-full b")).toBeNull();
  });

  it("passes id and attributes to the root", () => {
    const { document } = render(name, { text, ellipsis: "…", id: "x", attributes: { "data-testid": "mt" } });
    const root = document.querySelector(".middle-truncation");
    expect(root.id).toBe("x");
    expect(root.getAttribute("data-testid")).toBe("mt");
  });
});
