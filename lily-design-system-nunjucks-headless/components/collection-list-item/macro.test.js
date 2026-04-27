import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("collection-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("collection-list-item", { heading: "Title" });
    const el = document.querySelector("li.collection-list-item");
    expect(el).toBeTruthy();
  });

  it("renders the heading inside an <h3>", () => {
    const { document } = render("collection-list-item", { heading: "Title" });
    const h = document.querySelector("li.collection-list-item h3.collection-list-item-heading");
    expect(h).toBeTruthy();
    expect(h.textContent.trim()).toBe("Title");
  });

  it("wraps the heading in an <a> when href is provided", () => {
    const { document } = render("collection-list-item", {
      heading: "Title",
      href: "/path",
    });
    const a = document.querySelector("li.collection-list-item h3 a");
    expect(a).toBeTruthy();
    expect(a.getAttribute("href")).toBe("/path");
    expect(a.textContent.trim()).toBe("Title");
  });

  it("does not wrap the heading in an <a> when href is omitted", () => {
    const { document } = render("collection-list-item", { heading: "Title" });
    expect(document.querySelector("li.collection-list-item h3 a")).toBeNull();
  });

  it("renders the meta line when provided", () => {
    const { document } = render("collection-list-item", {
      heading: "Title",
      meta: "Apr 27, 2026",
    });
    const m = document.querySelector("p.collection-list-item-meta");
    expect(m.textContent).toBe("Apr 27, 2026");
  });

  it("renders the description when provided", () => {
    const { document } = render("collection-list-item", {
      heading: "Title",
      description: "Lead paragraph",
    });
    const d = document.querySelector("p.collection-list-item-description");
    expect(d.textContent).toBe("Lead paragraph");
  });

  it("renders the image when imageUrl provided", () => {
    const { document } = render("collection-list-item", {
      heading: "Title",
      imageUrl: "/img.png",
      imageAlt: "alt text",
    });
    const img = document.querySelector("img.collection-list-item-image");
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe("/img.png");
    expect(img.getAttribute("alt")).toBe("alt text");
  });

  it("renders aria-label when provided", () => {
    const { document } = render("collection-list-item", {
      heading: "Title",
      label: "named",
    });
    expect(document.querySelector("li.collection-list-item").getAttribute("aria-label"))
      .toBe("named");
  });

  it("appends params.classes", () => {
    const { document } = render("collection-list-item", {
      heading: "Title",
      classes: "featured",
    });
    expect(document.querySelector("li.collection-list-item.featured")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("collection-list-item", {
      heading: "Title",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("li.collection-list-item").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("collection-list-item", { heading: "Title" });
    expect(html).not.toContain("<style");
  });
});
