import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("contents-list", () => {
  it("renders an <ol> with the base class", () => {
    const { document } = render("contents-list", {});
    expect(document.querySelector("ol.contents-list")).toBeTruthy();
  });

  it("renders caller content", () => {
    const { document } = render(
      "contents-list",
      {},
      '<li class="contents-list-item"></li>',
    );
    expect(
      document.querySelector("ol.contents-list li.contents-list-item"),
    ).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("contents-list", { classes: "sub" });
    expect(document.querySelector("ol.contents-list.sub")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("contents-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
