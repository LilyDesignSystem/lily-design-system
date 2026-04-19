import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("url-input", () => {
  it("renders an <input type=url> with the base class", () => {
    const { document } = render("url-input", { id: "u" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("url");
    expect(el.classList.contains("url-input")).toBe(true);
  });

  it("supports autocomplete='url'", () => {
    const { document } = render("url-input", {
      id: "u",
      autocomplete: "url",
    });
    expect(document.querySelector("input").getAttribute("autocomplete"))
      .toBe("url");
  });

  it("renders value", () => {
    const { document } = render("url-input", {
      id: "u",
      value: "https://example.com",
    });
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("https://example.com");
  });

  it("appends params.classes", () => {
    const { document } = render("url-input", { id: "u", classes: "wide" });
    expect(document.querySelector("input.url-input.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("url-input", { id: "u" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
