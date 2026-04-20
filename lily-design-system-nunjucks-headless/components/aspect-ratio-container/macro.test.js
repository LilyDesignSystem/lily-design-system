import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("aspect-ratio-container", () => {
  it("renders a <div> with the base class and default ratio", () => {
    const { document } = render("aspect-ratio-container", {});
    const el = document.querySelector("div.aspect-ratio-container");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-ratio")).toBe("16/9");
    expect(el.getAttribute("style")).toContain("--aspect-ratio: 16/9");
  });

  it("respects a custom ratio", () => {
    const { document } = render("aspect-ratio-container", { ratio: "4/3" });
    const el = document.querySelector("div.aspect-ratio-container");
    expect(el.getAttribute("data-ratio")).toBe("4/3");
    expect(el.getAttribute("style")).toContain("--aspect-ratio: 4/3");
  });

  it("renders caller block content", () => {
    const { document } = render(
      "aspect-ratio-container",
      {},
      '<img src="x" alt="">',
    );
    expect(document.querySelector("div img")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("aspect-ratio-container", { classes: "wide" });
    expect(document.querySelector("div.aspect-ratio-container.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("aspect-ratio-container", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
