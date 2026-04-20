import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("resizable", () => {
  it("renders a <div role=group>", () => {
    const { document } = render("resizable", {});
    const el = document.querySelector("div.resizable");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("resizable", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
