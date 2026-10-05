import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "streaming-text";

describe("streaming-text", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render(name, { text: "Hello" });
    expect(document.querySelector("div.streaming-text")).toBeTruthy();
  });

  it("is a polite, atomic status region", () => {
    const { document } = render(name, { text: "Hello" });
    const el = document.querySelector("div");
    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("aria-live")).toBe("polite");
    expect(el.getAttribute("aria-atomic")).toBe("true");
  });

  it("is not busy by default", () => {
    const { document } = render(name, { text: "Hello" });
    const el = document.querySelector("div");
    expect(el.hasAttribute("aria-busy")).toBe(false);
    expect(el.hasAttribute("data-streaming")).toBe(false);
  });

  it("marks the region busy when streaming is true", () => {
    const { document } = render(name, { streaming: true, text: "Hel" });
    const el = document.querySelector("div");
    expect(el.getAttribute("aria-busy")).toBe("true");
    expect(el.getAttribute("data-streaming")).toBe("true");
  });

  it("sets aria-label from label, and omits it without one", () => {
    expect(render(name, { label: "Answer", text: "x" }).document.querySelector("div").getAttribute("aria-label")).toBe("Answer");
    expect(render(name, { text: "x" }).document.querySelector("div").hasAttribute("aria-label")).toBe(false);
  });

  it("puts the base class first, then the consumer class", () => {
    const { document } = render(name, { classes: "mine", text: "x" });
    expect(document.querySelector("div").getAttribute("class")).toBe("streaming-text mine");
  });

  it("renders text, html and caller content", () => {
    expect(render(name, { text: "Hello" }).document.querySelector("div").textContent).toBe("Hello");
    expect(render(name, { html: "<b>Hi</b>" }).document.querySelector("div > b")).toBeTruthy();
    expect(render(name, {}, "<i>c</i>").document.querySelector("div > i")).toBeTruthy();
  });

  it("sets id and extra attributes", () => {
    const { document } = render(name, { id: "s1", attributes: { "data-x": "1" }, text: "x" });
    const el = document.querySelector("div");
    expect(el.getAttribute("id")).toBe("s1");
    expect(el.getAttribute("data-x")).toBe("1");
  });

  it("contains no <style> or <script> tags or inline styles", () => {
    const { html } = render(name, { streaming: true, text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
