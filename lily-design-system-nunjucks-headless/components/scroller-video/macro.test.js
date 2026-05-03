import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("scroller-video", () => {
  it("renders a <div> with class scroller-video", () => {
    const { document } = render("scroller-video", {
      src: "/v.mp4", label: "Story", alt: "A video",
    }, "<section>step</section>");
    expect(document.querySelector("div.scroller-video")).toBeTruthy();
  });

  it("applies aria-label from label param", () => {
    const { document } = render("scroller-video", {
      src: "/v.mp4", label: "Story", alt: "alt",
    }, "<section>step</section>");
    expect(document.querySelector(".scroller-video").getAttribute("aria-label")).toBe("Story");
  });

  it("renders a <video> with src", () => {
    const { document } = render("scroller-video", {
      src: "/v.mp4", label: "x", alt: "alt",
    }, "<section>step</section>");
    const video = document.querySelector("video.scroller-video-element");
    expect(video.getAttribute("src")).toBe("/v.mp4");
  });

  it("background region exposes role=img with alt as aria-label", () => {
    const { document } = render("scroller-video", {
      src: "/v.mp4", label: "x", alt: "A waterfall",
    }, "<section>step</section>");
    const bg = document.querySelector(".scroller-video-background");
    expect(bg.getAttribute("role")).toBe("img");
    expect(bg.getAttribute("aria-roledescription")).toBe("scrollable video");
    expect(bg.getAttribute("aria-label")).toBe("A waterfall");
  });

  it("renders foreground inside scroller-video-foreground", () => {
    const { document } = render("scroller-video", {
      src: "/v.mp4", label: "x", alt: "alt",
    }, "<section>step 1</section><section>step 2</section>");
    const fg = document.querySelector(".scroller-video-foreground");
    expect(fg.querySelectorAll("section").length).toBe(2);
  });
});
