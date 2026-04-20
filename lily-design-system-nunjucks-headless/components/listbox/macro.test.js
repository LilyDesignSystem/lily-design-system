import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("listbox", () => {
  it("renders a <ul role=listbox>", () => {
    const { document } = render("listbox", { label: "Colours" });
    const el = document.querySelector("ul.listbox");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("listbox");
    expect(el.getAttribute("aria-label")).toBe("Colours");
  });

  it("supports multiselectable", () => {
    const { document } = render("listbox", { multiselectable: true });
    expect(document.querySelector("ul").getAttribute("aria-multiselectable"))
      .toBe("true");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("listbox", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
