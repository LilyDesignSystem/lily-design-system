import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("inset-text", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("inset-text", { text: "Info" });
    const el = document.querySelector("div");
    expect(el).toBeTruthy();
    expect(el.classList.contains("inset-text")).toBe(true);
  });

  it("escapes params.text", () => {
    const { document } = render("inset-text", { text: "A & B" });
    expect(document.querySelector("div").textContent).toContain("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("inset-text", { html: "<p>Note</p>" });
    expect(document.querySelector("div p")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("inset-text", { text: "x", classes: "muted" });
    expect(document.querySelector("div.inset-text.muted")).toBeTruthy();
  });

  it("renders a screen-reader prefix when provided", () => {
    const { document } = render("inset-text", {
      text: "Message",
      screenReaderPrefix: "Information:",
    });
    const prefix = document.querySelector("div span.visually-hidden");
    expect(prefix).toBeTruthy();
    expect(prefix.textContent).toContain("Information:");
  });

  it("omits the screen-reader prefix when not provided", () => {
    const { document } = render("inset-text", { text: "Message" });
    expect(document.querySelector("div span.visually-hidden")).toBeNull();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("inset-text", { text: "x", label: "Note" });
    expect(document.querySelector("div").getAttribute("aria-label")).toBe("Note");
  });

  it("renders params.attributes", () => {
    const { document } = render("inset-text", {
      text: "x",
      attributes: { "data-tone": "info" },
    });
    expect(document.querySelector("div").getAttribute("data-tone")).toBe("info");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("inset-text", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
