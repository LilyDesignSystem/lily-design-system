import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("chat-list", () => {
  it("renders an <ol> with the base class and role=log", () => {
    const { document } = render("chat-list", {});
    const el = document.querySelector("ol.chat-list");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("log");
    expect(el.getAttribute("aria-live")).toBe("polite");
  });

  it("respects params.live", () => {
    const { document } = render("chat-list", { live: "assertive" });
    expect(document.querySelector("ol.chat-list").getAttribute("aria-live"))
      .toBe("assertive");
  });

  it("renders caller content", () => {
    const { document } = render("chat-list", {}, '<li class="chat-list-item"></li>');
    expect(document.querySelector("ol.chat-list li.chat-list-item")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("chat-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
