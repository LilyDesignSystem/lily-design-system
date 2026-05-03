import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("video-player", () => {
  it("renders a <figure> with class video-player", () => {
    const { document } = render("video-player", { src: "/v.mp4", label: "Demo" });
    expect(document.querySelector("figure.video-player")).toBeTruthy();
  });

  it("applies aria-label from label param", () => {
    const { document } = render("video-player", { src: "/v.mp4", label: "Demo video" });
    expect(document.querySelector(".video-player").getAttribute("aria-label")).toBe("Demo video");
  });

  it("renders a <video> with src", () => {
    const { document } = render("video-player", { src: "/v.mp4", label: "x" });
    const video = document.querySelector("video.video-player-element");
    expect(video.getAttribute("src")).toBe("/v.mp4");
  });

  it("controls default to true", () => {
    const { document } = render("video-player", { src: "/v.mp4", label: "x" });
    expect(document.querySelector("video").hasAttribute("controls")).toBe(true);
  });

  it("controls=false omits the controls attribute", () => {
    const { document } = render("video-player", { src: "/v.mp4", label: "x", controls: false });
    expect(document.querySelector("video").hasAttribute("controls")).toBe(false);
  });

  it("muted attribute is reflected", () => {
    const { document } = render("video-player", { src: "/v.mp4", label: "x", muted: true });
    expect(document.querySelector("video").hasAttribute("muted")).toBe(true);
  });

  it("poster attribute is reflected", () => {
    const { document } = render("video-player", { src: "/v.mp4", label: "x", poster: "/p.jpg" });
    expect(document.querySelector("video").getAttribute("poster")).toBe("/p.jpg");
  });

  it("renders captionText inside figcaption when provided", () => {
    const { document } = render("video-player", { src: "/v.mp4", label: "x", captionText: "A caption" });
    expect(document.querySelector("figcaption.video-player-caption").textContent).toBe("A caption");
  });

  it("omits figcaption when no caption provided", () => {
    const { document } = render("video-player", { src: "/v.mp4", label: "x" });
    expect(document.querySelector("figcaption")).toBeNull();
  });
});
