import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("text-input-with-search", () => {
  it("renders an input[type=search] and a submit button", () => {
    const { document } = render("text-input-with-search", {
      id: "q",
      name: "q",
      label: "Search",
    });
    const input = document.querySelector("input.text-input-with-search-input");
    expect(input.getAttribute("type")).toBe("search");
    expect(input.getAttribute("aria-label")).toBe("Search");
    const btn = document.querySelector("button.text-input-with-search-button");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("submit");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("text-input-with-search", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
