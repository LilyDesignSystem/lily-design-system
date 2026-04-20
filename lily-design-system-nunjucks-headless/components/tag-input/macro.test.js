import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tag-input", () => {
  it("renders a list of tags and a text input", () => {
    const { document } = render("tag-input", {
      id: "tags",
      name: "tags",
      tags: ["diabetes", "hypertension"],
      label: "Tags",
    });
    expect(document.querySelector("div.tag-input")).toBeTruthy();
    const items = document.querySelectorAll("li.tag-input-list-item");
    expect(items.length).toBe(2);
    expect(items[0].querySelector(".tag-input-list-item-text").textContent.trim())
      .toBe("diabetes");
    expect(items[0].querySelector("input[type=hidden]").getAttribute("value"))
      .toBe("diabetes");
    expect(document.querySelector("input.tag-input-field").getAttribute("aria-label"))
      .toBe("Tags");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tag-input", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
