import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("medical-banner-box", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("medical-banner-box", { text: "Jane Smith" });
    expect(document.querySelector("div.medical-banner-box")).toBeTruthy();
  });

  it("escapes params.text", () => {
    const { document } = render("medical-banner-box", { text: "A & B" });
    expect(document.querySelector("div.medical-banner-box").textContent.trim())
      .toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("medical-banner-box", {
      html: "<strong>Jane Smith</strong>",
    });
    expect(document.querySelector("div.medical-banner-box strong")).toBeTruthy();
  });

  it("sets aria-label", () => {
    const { document } = render("medical-banner-box", {
      text: "x",
      label: "Patient name",
    });
    expect(document.querySelector("div.medical-banner-box").getAttribute("aria-label"))
      .toBe("Patient name");
  });

  it("appends params.classes", () => {
    const { document } = render("medical-banner-box", {
      text: "x",
      classes: "identity",
    });
    expect(document.querySelector("div.medical-banner-box.identity")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("medical-banner-box", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
