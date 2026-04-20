import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("chat-nav", () => {
  it("renders a <nav> with the base class and default aria-label", () => {
    const { document } = render("chat-nav", {});
    const el = document.querySelector("nav.chat-nav");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Chat");
  });

  it("respects params.label", () => {
    const { document } = render("chat-nav", { label: "Team chat" });
    expect(document.querySelector("nav.chat-nav").getAttribute("aria-label"))
      .toBe("Team chat");
  });

  it("prefers labelledBy over label", () => {
    const { document } = render("chat-nav", { label: "x", labelledBy: "h" });
    const el = document.querySelector("nav.chat-nav");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render("chat-nav", {}, '<ol class="chat-list"></ol>');
    expect(document.querySelector("nav.chat-nav ol.chat-list")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("chat-nav", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
