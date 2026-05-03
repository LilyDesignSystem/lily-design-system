import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("horizontal-scroller", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("horizontal-scroller", { label: "Test" }, "content");
    expect(document.querySelector("div.horizontal-scroller")).toBeTruthy();
  });

  it("applies role='region'", () => {
    const { document } = render("horizontal-scroller", { label: "Test" }, "content");
    expect(document.querySelector(".horizontal-scroller").getAttribute("role")).toBe("region");
  });

  it("applies aria-label from label param", () => {
    const { document } = render("horizontal-scroller", { label: "Hello" }, "x");
    expect(document.querySelector(".horizontal-scroller").getAttribute("aria-label")).toBe("Hello");
  });

  it("renders the caller content", () => {
    const { document } = render("horizontal-scroller", { label: "Test" }, "<span>hello</span>");
    expect(document.querySelector(".horizontal-scroller span").textContent).toBe("hello");
  });
});
