import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("dial", () => {
  it("renders an <input type=range> with the base class", () => {
    const { document } = render("dial", {
      id: "d", value: 50, label: "Volume",
    });
    const el = document.querySelector("input.dial");
    expect(el).toBeTruthy();
    expect(el.getAttribute("type")).toBe("range");
    expect(el.getAttribute("aria-label")).toBe("Volume");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("dial", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
