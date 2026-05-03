import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("content-block", () => {
  it("renders a <div> with class content-block", () => {
    const { document } = render("content-block", {}, "content");
    expect(document.querySelector("div.content-block")).toBeTruthy();
  });

  it("data-width defaults to normal", () => {
    const { document } = render("content-block", {}, "x");
    expect(document.querySelector(".content-block").getAttribute("data-width")).toBe("normal");
  });

  it("data-width reflects the width param", () => {
    const { document } = render("content-block", { width: "wide" }, "x");
    expect(document.querySelector(".content-block").getAttribute("data-width")).toBe("wide");
  });

  it("renders the caller content", () => {
    const { document } = render("content-block", {}, "<span>hello</span>");
    expect(document.querySelector(".content-block span").textContent).toBe("hello");
  });
});
