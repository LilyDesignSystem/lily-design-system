import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("combobox", () => {
  it("renders a <div> with a role=combobox input and a role=listbox", () => {
    const { document } = render("combobox", {
      id: "c",
      label: "Search",
    });
    const wrap = document.querySelector("div.combobox");
    expect(wrap).toBeTruthy();
    const input = document.querySelector("input[role=combobox]");
    expect(input).toBeTruthy();
    expect(input.getAttribute("aria-controls")).toBe("c-listbox");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    const list = document.querySelector("ul[role=listbox]");
    expect(list).toBeTruthy();
    expect(list.hasAttribute("hidden")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("combobox", { id: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
