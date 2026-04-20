import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("ai-label", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("ai-label", {});
    expect(document.querySelector("span.ai-label")).toBeTruthy();
  });

  it("defaults visible text to 'AI'", () => {
    const { document } = render("ai-label", {});
    expect(document.querySelector("span.ai-label").textContent.trim())
      .toBe("AI");
  });

  it("respects a custom text", () => {
    const { document } = render("ai-label", {
      text: "AI-generated",
    });
    expect(document.querySelector("span.ai-label").textContent.trim())
      .toBe("AI-generated");
  });

  it("renders params.html raw", () => {
    const { document } = render("ai-label", {
      html: "<strong>AI</strong>",
    });
    expect(document.querySelector("span.ai-label strong")).toBeTruthy();
  });

  it("sets aria-label when provided", () => {
    const { document } = render("ai-label", {
      label: "AI-assisted content",
    });
    expect(document.querySelector("span.ai-label").getAttribute("aria-label"))
      .toBe("AI-assisted content");
  });

  it("sets aria-describedby for AI explainability", () => {
    const { document } = render("ai-label", {
      describedBy: "ai-explanation",
    });
    expect(document.querySelector("span.ai-label").getAttribute("aria-describedby"))
      .toBe("ai-explanation");
  });

  it("appends params.classes", () => {
    const { document } = render("ai-label", { classes: "prominent" });
    expect(document.querySelector("span.ai-label.prominent")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("ai-label", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
