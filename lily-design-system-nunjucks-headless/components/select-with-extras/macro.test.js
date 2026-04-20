import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("select-with-extras", () => {
  it("renders a <select> with data-module", () => {
    const { document } = render("select-with-extras", { label: "Choose" });
    const el = document.querySelector("select.select-with-extras");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-module")).toBe("select-with-extras");
    expect(el.getAttribute("aria-label")).toBe("Choose");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("select-with-extras", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
