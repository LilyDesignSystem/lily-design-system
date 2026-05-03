import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("scroller", () => {
  it("renders a <div> with class scroller", () => {
    const { document } = render("scroller", {
      backgroundHtml: "<div>BG</div>",
    }, "<section>step</section>");
    expect(document.querySelector("div.scroller")).toBeTruthy();
  });

  it("renders background inside scroller-background with aria-live=polite", () => {
    const { document } = render("scroller", {
      backgroundHtml: "<div>BG</div>",
    }, "<section>step</section>");
    const bg = document.querySelector(".scroller-background");
    expect(bg.getAttribute("aria-live")).toBe("polite");
    expect(bg.textContent.trim()).toBe("BG");
  });

  it("renders foreground inside scroller-foreground with scroller-base class", () => {
    const { document } = render("scroller", { backgroundHtml: "<div></div>" },
      "<section>step 1</section><section>step 2</section>");
    const fg = document.querySelector(".scroller-foreground");
    expect(fg).toBeTruthy();
    expect(fg.classList.contains("scroller-base")).toBe(true);
    expect(fg.querySelectorAll("section").length).toBe(2);
  });

  it("applies aria-label when label provided", () => {
    const { document } = render("scroller", {
      label: "Story",
      backgroundHtml: "<div></div>",
    }, "<section>step</section>");
    expect(document.querySelector(".scroller").getAttribute("aria-label")).toBe("Story");
  });
});
