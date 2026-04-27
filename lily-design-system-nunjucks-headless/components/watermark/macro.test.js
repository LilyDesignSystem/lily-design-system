import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("watermark", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("watermark", {}, "<article>x</article>");
    expect(document.querySelector("div.watermark")).toBeTruthy();
  });

  it("renders the decorative overlay with aria-hidden", () => {
    const { document } = render("watermark", {}, "<article>x</article>");
    const overlay = document.querySelector("div.watermark-overlay");
    expect(overlay).toBeTruthy();
    expect(overlay.getAttribute("aria-hidden")).toBe("true");
  });

  it("defaults data-gap to '100px'", () => {
    const { document } = render("watermark", {}, "<article>x</article>");
    expect(document.querySelector("div.watermark").getAttribute("data-gap"))
      .toBe("100px");
  });

  it("defaults data-rotate to '-22'", () => {
    const { document } = render("watermark", {}, "<article>x</article>");
    expect(document.querySelector("div.watermark").getAttribute("data-rotate"))
      .toBe("-22");
  });

  it("uses provided gap", () => {
    const { document } = render(
      "watermark",
      { gap: "200px" },
      "<article>x</article>",
    );
    expect(document.querySelector("div.watermark").getAttribute("data-gap"))
      .toBe("200px");
  });

  it("uses provided rotate", () => {
    const { document } = render(
      "watermark",
      { rotate: 45 },
      "<article>x</article>",
    );
    expect(document.querySelector("div.watermark").getAttribute("data-rotate"))
      .toBe("45");
  });

  it("supports rotate = 0", () => {
    const { document } = render(
      "watermark",
      { rotate: 0 },
      "<article>x</article>",
    );
    expect(document.querySelector("div.watermark").getAttribute("data-rotate"))
      .toBe("0");
  });

  it("renders data-text on the overlay when text is provided", () => {
    const { document } = render(
      "watermark",
      { text: "Confidential" },
      "<article>x</article>",
    );
    expect(
      document.querySelector("div.watermark-overlay").getAttribute("data-text"),
    ).toBe("Confidential");
  });

  it("renders data-image-url on the overlay when imageUrl is provided", () => {
    const { document } = render(
      "watermark",
      { imageUrl: "/wm.png" },
      "<article>x</article>",
    );
    expect(
      document.querySelector("div.watermark-overlay").getAttribute("data-image-url"),
    ).toBe("/wm.png");
  });

  it("places the overlay before the content", () => {
    const { document } = render(
      "watermark",
      { text: "WM" },
      "<article class='content'>x</article>",
    );
    const root = document.querySelector("div.watermark");
    const first = root.firstElementChild;
    expect(first.classList.contains("watermark-overlay")).toBe(true);
    expect(root.querySelector("article.content")).toBeTruthy();
  });

  it("renders contentHtml as raw HTML", () => {
    const { document } = render("watermark", {
      contentHtml: "<article class='inner'>x</article>",
    });
    expect(document.querySelector("div.watermark article.inner")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render(
      "watermark",
      { classes: "extra" },
      "<article>x</article>",
    );
    expect(document.querySelector("div.watermark.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render(
      "watermark",
      { attributes: { "data-test": "x" } },
      "<article>x</article>",
    );
    expect(document.querySelector("div.watermark").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("watermark", {}, "<article>x</article>");
    expect(html).not.toContain("<style");
  });
});
