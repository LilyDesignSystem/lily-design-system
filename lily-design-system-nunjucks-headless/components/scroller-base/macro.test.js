import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("scroller-base", () => {
  it("renders a <div> with class scroller-base", () => {
    const { document } = render("scroller-base", {}, "<section>step</section>");
    expect(document.querySelector("div.scroller-base")).toBeTruthy();
  });

  it("data-offset defaults to 0.5", () => {
    const { document } = render("scroller-base", {}, "x");
    expect(document.querySelector(".scroller-base").getAttribute("data-offset")).toBe("0.5");
  });

  it("data-offset reflects the offset param", () => {
    const { document } = render("scroller-base", { offset: 0.75 }, "x");
    expect(document.querySelector(".scroller-base").getAttribute("data-offset")).toBe("0.75");
  });

  it("applies aria-label when label provided", () => {
    const { document } = render("scroller-base", { label: "Story" }, "x");
    expect(document.querySelector(".scroller-base").getAttribute("aria-label")).toBe("Story");
  });

  it("renders caller content", () => {
    const { document } = render("scroller-base", {}, "<section>step 1</section><section>step 2</section>");
    expect(document.querySelectorAll(".scroller-base > section").length).toBe(2);
  });
});
