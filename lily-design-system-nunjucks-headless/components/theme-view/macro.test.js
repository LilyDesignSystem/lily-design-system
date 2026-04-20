import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("theme-view", () => {
  it("renders a <span> with the base class and data-theme", () => {
    const { document } = render("theme-view", { theme: "dark" });
    const el = document.querySelector("span.theme-view");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-theme")).toBe("dark");
    expect(el.textContent.trim()).toBe("dark");
  });

  it("uses text override when provided", () => {
    const { document } = render("theme-view", {
      theme: "dark",
      text: "Dark mode",
    });
    expect(document.querySelector("span").textContent.trim()).toBe("Dark mode");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("theme-view", { theme: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
