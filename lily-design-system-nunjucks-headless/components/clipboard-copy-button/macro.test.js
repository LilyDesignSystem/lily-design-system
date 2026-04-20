import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("clipboard-copy-button", () => {
  it("renders a <button> with the base class and data-module", () => {
    const { document } = render("clipboard-copy-button", {
      clipboardText: "hello",
    });
    const el = document.querySelector("button.clipboard-copy-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-module")).toBe("clipboard-copy-button");
  });

  it("defaults text to 'Copy'", () => {
    const { document } = render("clipboard-copy-button", {
      clipboardText: "x",
    });
    expect(document.querySelector("button.clipboard-copy-button").textContent.trim())
      .toBe("Copy");
  });

  it("respects a custom text", () => {
    const { document } = render("clipboard-copy-button", {
      text: "Copy NHS number",
      clipboardText: "4857773456",
    });
    expect(document.querySelector("button.clipboard-copy-button").textContent.trim())
      .toBe("Copy NHS number");
  });

  it("sets data-clipboard-text when clipboardText is provided", () => {
    const { document } = render("clipboard-copy-button", {
      clipboardText: "hello",
    });
    expect(
      document.querySelector("button.clipboard-copy-button").getAttribute("data-clipboard-text"),
    ).toBe("hello");
  });

  it("sets data-clipboard-target when target is provided", () => {
    const { document } = render("clipboard-copy-button", {
      target: "#code",
    });
    expect(
      document.querySelector("button.clipboard-copy-button").getAttribute("data-clipboard-target"),
    ).toBe("#code");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("clipboard-copy-button", {
      clipboardText: "x",
      label: "Copy to clipboard",
    });
    expect(document.querySelector("button.clipboard-copy-button").getAttribute("aria-label"))
      .toBe("Copy to clipboard");
  });

  it("appends params.classes", () => {
    const { document } = render("clipboard-copy-button", {
      clipboardText: "x",
      classes: "small",
    });
    expect(document.querySelector("button.clipboard-copy-button.small")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("clipboard-copy-button", { clipboardText: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
