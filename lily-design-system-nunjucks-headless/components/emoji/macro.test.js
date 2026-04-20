import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("emoji", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("emoji", {
      text: "🚑",
      label: "Ambulance",
    });
    expect(document.querySelector("span.emoji")).toBeTruthy();
  });

  it("sets role='img' and aria-label by default", () => {
    const { document } = render("emoji", {
      text: "🚑",
      label: "Ambulance",
    });
    const el = document.querySelector("span.emoji");
    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toBe("Ambulance");
  });

  it("sets aria-hidden when decorative", () => {
    const { document } = render("emoji", {
      text: "📞",
      decorative: true,
    });
    const el = document.querySelector("span.emoji");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("role")).toBe(false);
  });

  it("renders the emoji character as content", () => {
    const { document } = render("emoji", {
      text: "🚑",
      label: "Ambulance",
    });
    expect(document.querySelector("span.emoji").textContent).toBe("🚑");
  });

  it("appends params.classes", () => {
    const { document } = render("emoji", {
      text: "🚑",
      label: "Ambulance",
      classes: "large",
    });
    expect(document.querySelector("span.emoji.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("emoji", { text: "🚑", label: "Ambulance" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
