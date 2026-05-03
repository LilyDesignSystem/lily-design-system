import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("theme-provider", () => {
  it("renders a <div> with class theme-provider", () => {
    const { document } = render("theme-provider", { theme: { primary: "#fff" } }, "x");
    expect(document.querySelector("div.theme-provider")).toBeTruthy();
  });

  it("defaults data-theme to light", () => {
    const { document } = render("theme-provider", { theme: { primary: "#fff" } }, "x");
    expect(document.querySelector(".theme-provider").getAttribute("data-theme")).toBe("light");
  });

  it("applies data-theme=dark when base=dark", () => {
    const { document } = render("theme-provider", { theme: { primary: "#000" }, base: "dark" }, "x");
    expect(document.querySelector(".theme-provider").getAttribute("data-theme")).toBe("dark");
  });

  it("flattens theme keys to --theme-* CSS variables", () => {
    const { document } = render("theme-provider", { theme: { primary: "#fff", danger: "#dc2626" } }, "x");
    const style = document.querySelector(".theme-provider").getAttribute("style");
    expect(style).toContain("--theme-primary: #fff");
    expect(style).toContain("--theme-danger: #dc2626");
  });

  it("uses display: contents", () => {
    const { document } = render("theme-provider", { theme: { primary: "#fff" } }, "x");
    expect(document.querySelector(".theme-provider").getAttribute("style")).toContain("display: contents");
  });
});
