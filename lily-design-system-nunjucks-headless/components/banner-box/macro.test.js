import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("banner-box", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("banner-box", { text: "Welcome" });
    expect(document.querySelector("div.banner-box")).toBeTruthy();
  });

  it("escapes params.text", () => {
    const { document } = render("banner-box", { text: "A & B" });
    expect(document.querySelector("div.banner-box").textContent.trim())
      .toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("banner-box", { html: "<em>New</em>" });
    expect(document.querySelector("div.banner-box em")).toBeTruthy();
  });

  it("sets aria-label", () => {
    const { document } = render("banner-box", { text: "x", label: "Message" });
    expect(document.querySelector("div.banner-box").getAttribute("aria-label"))
      .toBe("Message");
  });

  it("appends params.classes", () => {
    const { document } = render("banner-box", { text: "x", classes: "primary" });
    expect(document.querySelector("div.banner-box.primary")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("banner-box", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
