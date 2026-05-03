import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("padding-reset", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("padding-reset", {}, "content");
    expect(document.querySelector("div.padding-reset")).toBeTruthy();
  });

  it("does not set aria-label by default", () => {
    const { document } = render("padding-reset", {}, "x");
    expect(document.querySelector(".padding-reset").getAttribute("aria-label")).toBeNull();
  });

  it("renders the caller content", () => {
    const { document } = render("padding-reset", {}, "<span>hello</span>");
    expect(document.querySelector(".padding-reset span").textContent).toBe("hello");
  });
});
