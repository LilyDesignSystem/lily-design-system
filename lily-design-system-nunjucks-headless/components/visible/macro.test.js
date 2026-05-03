import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("visible", () => {
  it("renders a <div> with class visible", () => {
    const { document } = render("visible", {}, "x");
    expect(document.querySelector("div.visible")).toBeTruthy();
  });

  it("exposes data-visible='false' for consumer JS", () => {
    const { document } = render("visible", {}, "x");
    expect(document.querySelector(".visible").getAttribute("data-visible")).toBe("false");
  });

  it("renders caller content", () => {
    const { document } = render("visible", {}, "<span>hello</span>");
    expect(document.querySelector(".visible span").textContent).toBe("hello");
  });
});
