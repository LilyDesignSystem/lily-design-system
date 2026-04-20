import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tile", () => {
  it("renders an <a> when href is provided", () => {
    const { document } = render("tile", {
      href: "/x",
      heading: "Go",
      text: "Click to go",
    });
    const el = document.querySelector("a.tile");
    expect(el).toBeTruthy();
    expect(el.getAttribute("href")).toBe("/x");
    expect(document.querySelector(".tile-heading").textContent.trim()).toBe("Go");
  });

  it("renders a <div> when href is absent", () => {
    const { document } = render("tile", { heading: "Info" });
    expect(document.querySelector("div.tile")).toBeTruthy();
    expect(document.querySelector("a.tile")).toBeFalsy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tile", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
