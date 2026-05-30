import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("qr-code-image", () => {
  it("renders an <img> with src and alt", () => {
    const { document } = render("qr-code-image", {
      src: "/qr.png",
      alt: "Booking link",
    });
    const el = document.querySelector("img.qr-code-image");
    expect(el).toBeTruthy();
    expect(el.getAttribute("src")).toBe("/qr.png");
    expect(el.getAttribute("alt")).toBe("Booking link");
  });

  it("defaults alt to 'QR code'", () => {
    const { document } = render("qr-code-image", { src: "/qr.png" });
    expect(document.querySelector("img").getAttribute("alt")).toBe("QR code");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("qr-code-image", { src: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
