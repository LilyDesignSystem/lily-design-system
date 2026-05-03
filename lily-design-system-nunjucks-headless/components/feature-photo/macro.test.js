import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("feature-photo", () => {
  it("renders a <figure> with class feature-photo", () => {
    const { document } = render("feature-photo", { src: "/p.jpg", alt: "A photo" });
    expect(document.querySelector("figure.feature-photo")).toBeTruthy();
  });

  it("renders an <img> with src and alt", () => {
    const { document } = render("feature-photo", { src: "/p.jpg", alt: "A photo" });
    const img = document.querySelector("img.feature-photo-image");
    expect(img.getAttribute("src")).toBe("/p.jpg");
    expect(img.getAttribute("alt")).toBe("A photo");
  });

  it("defaults loading to lazy", () => {
    const { document } = render("feature-photo", { src: "/p.jpg", alt: "A" });
    expect(document.querySelector("img").getAttribute("loading")).toBe("lazy");
  });

  it("supports loading=eager", () => {
    const { document } = render("feature-photo", { src: "/p.jpg", alt: "A", loading: "eager" });
    expect(document.querySelector("img").getAttribute("loading")).toBe("eager");
  });

  it("applies width and height", () => {
    const { document } = render("feature-photo", { src: "/p.jpg", alt: "A", width: 1200, height: 800 });
    expect(document.querySelector("img").getAttribute("width")).toBe("1200");
    expect(document.querySelector("img").getAttribute("height")).toBe("800");
  });

  it("renders caption when provided", () => {
    const { document } = render("feature-photo", { src: "/p.jpg", alt: "A", caption: "Sunset" });
    expect(document.querySelector(".feature-photo-caption-text").textContent).toBe("Sunset");
  });

  it("renders credit when provided", () => {
    const { document } = render("feature-photo", { src: "/p.jpg", alt: "A", credit: "Jane" });
    expect(document.querySelector(".feature-photo-credit").textContent).toBe("Jane");
  });

  it("omits figcaption when neither caption nor credit", () => {
    const { document } = render("feature-photo", { src: "/p.jpg", alt: "A" });
    expect(document.querySelector("figcaption")).toBeNull();
  });

  it("accepts empty alt for decorative images", () => {
    const { document } = render("feature-photo", { src: "/p.jpg", alt: "" });
    expect(document.querySelector("img").getAttribute("alt")).toBe("");
  });
});
