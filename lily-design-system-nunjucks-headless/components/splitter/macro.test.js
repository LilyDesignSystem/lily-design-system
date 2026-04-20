import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("splitter", () => {
  it("renders a <div role=separator>", () => {
    const { document } = render("splitter", {});
    const el = document.querySelector("div.splitter");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("separator");
    expect(el.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("splitter", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
