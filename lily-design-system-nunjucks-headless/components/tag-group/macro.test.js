import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tag-group", () => {
  it("renders a <ul role=list>", () => {
    const { document } = render("tag-group", { label: "Conditions" });
    const el = document.querySelector("ul.tag-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("list");
    expect(el.getAttribute("aria-label")).toBe("Conditions");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tag-group", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
