import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("affix", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("affix", {}, "<p>pinned</p>");
    const el = document.querySelector("div.affix");
    expect(el).toBeTruthy();
  });

  it("defaults to position: sticky; top: 0", () => {
    const { document } = render("affix", {}, "<p>x</p>");
    const el = document.querySelector("div.affix");
    expect(el.getAttribute("style")).toContain("position: sticky");
    expect(el.getAttribute("style")).toContain("top: 0");
  });

  it("uses offsetTop when provided", () => {
    const { document } = render("affix", { offsetTop: 16 }, "<p>x</p>");
    const el = document.querySelector("div.affix");
    expect(el.getAttribute("style")).toContain("top: 16px");
    expect(el.getAttribute("data-offset-top")).toBe("16");
  });

  it("uses offsetBottom when provided", () => {
    const { document } = render("affix", { offsetBottom: 24 }, "<p>x</p>");
    const el = document.querySelector("div.affix");
    expect(el.getAttribute("style")).toContain("bottom: 24px");
    expect(el.getAttribute("data-offset-bottom")).toBe("24");
  });

  it("renders caller content", () => {
    const { document } = render("affix", {}, "<nav class='inner'>n</nav>");
    expect(document.querySelector("div.affix nav.inner")).toBeTruthy();
  });

  it("renders params.html as raw HTML", () => {
    const { document } = render("affix", {
      html: "<span class='inner'>x</span>",
    });
    expect(document.querySelector("div.affix span.inner")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("affix", { classes: "extra" }, "<p>x</p>");
    expect(document.querySelector("div.affix.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("affix", {
      attributes: { "data-test": "x" },
    }, "<p>x</p>");
    expect(document.querySelector("div.affix").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("affix", {}, "<p>x</p>");
    expect(html).not.toContain("<style");
  });
});
