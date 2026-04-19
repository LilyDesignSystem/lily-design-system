import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("search-input", () => {
  it("renders an <input type=search> with the base class", () => {
    const { document } = render("search-input", { id: "q" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("search");
    expect(el.classList.contains("search-input")).toBe(true);
  });

  it("defaults name to id", () => {
    const { document } = render("search-input", { id: "q" });
    expect(document.querySelector("input").getAttribute("name")).toBe("q");
  });

  it("renders value", () => {
    const { document } = render("search-input", {
      id: "q",
      value: "flu symptoms",
    });
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("flu symptoms");
  });

  it("sets placeholder and inputmode", () => {
    const { document } = render("search-input", {
      id: "q",
      placeholder: "Search NHS.UK",
      inputmode: "search",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("placeholder")).toBe("Search NHS.UK");
    expect(el.getAttribute("inputmode")).toBe("search");
  });

  it("supports required, disabled, readonly, aria-invalid", () => {
    const { document } = render("search-input", {
      id: "q",
      required: true,
      disabled: true,
      readonly: true,
      invalid: true,
    });
    const el = document.querySelector("input");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.hasAttribute("readonly")).toBe(true);
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("search-input", { id: "q", classes: "wide" });
    expect(document.querySelector("input.search-input.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("search-input", { id: "q" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
