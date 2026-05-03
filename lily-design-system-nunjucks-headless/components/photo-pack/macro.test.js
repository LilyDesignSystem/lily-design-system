import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("photo-pack", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("photo-pack", { label: "Test" }, "content");
    expect(document.querySelector("div.photo-pack")).toBeTruthy();
  });

  it("applies role='group'", () => {
    const { document } = render("photo-pack", { label: "Test" }, "content");
    expect(document.querySelector(".photo-pack").getAttribute("role")).toBe("group");
  });

  it("applies aria-label from label param", () => {
    const { document } = render("photo-pack", { label: "Hello" }, "x");
    expect(document.querySelector(".photo-pack").getAttribute("aria-label")).toBe("Hello");
  });

  it("renders the caller content", () => {
    const { document } = render("photo-pack", { label: "Test" }, "<span>hello</span>");
    expect(document.querySelector(".photo-pack span").textContent).toBe("hello");
  });
});
