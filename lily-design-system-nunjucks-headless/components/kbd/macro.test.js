import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("kbd", () => {
  it("renders a <kbd> with the base class", () => {
    const { document } = render("kbd", { text: "Esc" });
    const el = document.querySelector("kbd");
    expect(el).toBeTruthy();
    expect(el.classList.contains("kbd")).toBe(true);
    expect(el.textContent.trim()).toBe("Esc");
  });

  it("escapes params.text", () => {
    const { document } = render("kbd", { text: "<X>" });
    expect(document.querySelector("kbd").textContent.trim()).toBe("<X>");
  });

  it("renders params.html raw", () => {
    const { document } = render("kbd", { html: "<strong>⌘</strong>" });
    expect(document.querySelector("kbd strong")).toBeTruthy();
  });

  it("sets aria-label when provided", () => {
    const { document } = render("kbd", { text: "⌘", label: "Command" });
    expect(document.querySelector("kbd").getAttribute("aria-label"))
      .toBe("Command");
  });

  it("appends params.classes", () => {
    const { document } = render("kbd", { text: "Esc", classes: "small" });
    expect(document.querySelector("kbd.kbd.small")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render("kbd", {}, "<em>Tab</em>");
    expect(document.querySelector("kbd em").textContent).toBe("Tab");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("kbd", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
