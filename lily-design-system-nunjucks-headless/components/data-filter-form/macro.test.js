import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("data-filter-form", () => {
  it("renders a <form role=search>", () => {
    const { document } = render("data-filter-form", { label: "Filters" });
    const el = document.querySelector("form.data-filter-form");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("search");
    expect(el.getAttribute("aria-label")).toBe("Filters");
    expect(el.getAttribute("method")).toBe("get");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("data-filter-form", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
