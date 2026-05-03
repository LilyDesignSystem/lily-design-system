import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("hero-headline", () => {
  it("renders a <div> with class hero-headline", () => {
    const { document } = render("hero-headline", { label: "Story" }, "Title");
    expect(document.querySelector("div.hero-headline")).toBeTruthy();
  });

  it("applies aria-label from label param", () => {
    const { document } = render("hero-headline", { label: "Story" }, "Title");
    expect(document.querySelector(".hero-headline").getAttribute("aria-label")).toBe("Story");
  });

  it("renders mediaHtml inside hero-headline-media", () => {
    const { document } = render("hero-headline", {
      label: "x",
      mediaHtml: "<img src=\"hero.jpg\" alt=\"\">",
    }, "Title");
    expect(document.querySelector(".hero-headline-media img").getAttribute("src")).toBe("hero.jpg");
  });

  it("renders caller content inside hero-headline-content", () => {
    const { document } = render("hero-headline", { label: "x" }, "Big Headline");
    expect(document.querySelector(".hero-headline-content").textContent.trim()).toBe("Big Headline");
  });
});
