import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("framer", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("framer", {}, "content");
    expect(document.querySelector("div.framer")).toBeTruthy();
  });

  it("does not set aria-label by default", () => {
    const { document } = render("framer", {}, "x");
    expect(document.querySelector(".framer").getAttribute("aria-label")).toBeNull();
  });

  it("renders the caller content", () => {
    const { document } = render("framer", {}, "<span>hello</span>");
    expect(document.querySelector(".framer span").textContent).toBe("hello");
  });
});
