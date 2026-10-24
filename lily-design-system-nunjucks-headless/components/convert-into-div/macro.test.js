import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("convertIntoDiv", () => {
  it("renders a div with the base class", () => {
    const { document } = render("convert-into-div", { text: "Example" });
    const el = document.querySelector("div.convert-into-div");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("Example");
  });

  it("appends params.classes", () => {
    const { document } = render("convert-into-div", { text: "x", classes: "extra" });
    expect(document.querySelector(".convert-into-div.extra")).toBeTruthy();
  });

  it("has no role and no aria-label", () => {
    const { document } = render("convert-into-div", { text: "x" });
    const el = document.querySelector(".convert-into-div");
    expect(el.getAttribute("role")).toBeNull();
    expect(el.getAttribute("aria-label")).toBeNull();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("convert-into-div", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
