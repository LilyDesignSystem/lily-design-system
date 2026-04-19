import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("error-message", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("error-message", {
      id: "e",
      text: "Enter your NHS number",
    });
    const el = document.querySelector("span.error-message");
    expect(el).toBeTruthy();
    expect(el.getAttribute("id")).toBe("e");
  });

  it("renders the visually-hidden prefix 'Error:' by default", () => {
    const { document } = render("error-message", { text: "x" });
    const prefix = document.querySelector("span.error-message span.visually-hidden");
    expect(prefix).toBeTruthy();
    expect(prefix.textContent).toBe("Error:");
  });

  it("respects a custom visually-hidden prefix", () => {
    const { document } = render("error-message", {
      text: "x",
      visuallyHiddenText: "Validation problem:",
    });
    expect(
      document.querySelector("span.error-message span.visually-hidden").textContent,
    ).toBe("Validation problem:");
  });

  it("escapes params.text", () => {
    const { document } = render("error-message", { text: "A & B" });
    const el = document.querySelector("span.error-message");
    expect(el.textContent).toContain("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("error-message", {
      html: "<strong>Required</strong>",
    });
    expect(document.querySelector("span.error-message strong")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("error-message", {
      text: "x",
      classes: "extra",
    });
    expect(document.querySelector("span.error-message.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("error-message", {
      text: "x",
      attributes: { "data-field": "nhs-number" },
    });
    expect(
      document.querySelector("span.error-message").getAttribute("data-field"),
    ).toBe("nhs-number");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("error-message", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
