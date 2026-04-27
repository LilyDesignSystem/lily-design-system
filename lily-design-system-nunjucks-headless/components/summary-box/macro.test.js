import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("summary-box", () => {
  it("renders an <aside> with the base class", () => {
    const { document } = render("summary-box", { heading: "Key takeaways" });
    expect(document.querySelector("aside.summary-box")).toBeTruthy();
  });

  it("defaults aria-label to the heading", () => {
    const { document } = render("summary-box", { heading: "Key takeaways" });
    expect(document.querySelector("aside.summary-box").getAttribute("aria-label"))
      .toBe("Key takeaways");
  });

  it("uses params.label when provided as aria-label override", () => {
    const { document } = render("summary-box", {
      heading: "Key takeaways",
      label: "Summary",
    });
    expect(document.querySelector("aside.summary-box").getAttribute("aria-label"))
      .toBe("Summary");
  });

  it("renders the heading inside <h3>", () => {
    const { document } = render("summary-box", { heading: "Key takeaways" });
    const h = document.querySelector("aside.summary-box h3.summary-box-heading");
    expect(h).toBeTruthy();
    expect(h.textContent.trim()).toBe("Key takeaways");
  });

  it("renders caller block content into the body", () => {
    const { document } = render(
      "summary-box",
      { heading: "Key takeaways" },
      "<p>First takeaway</p>",
    );
    expect(document.querySelector("aside.summary-box .summary-box-body p").textContent)
      .toBe("First takeaway");
  });

  it("renders raw html into the body", () => {
    const { document } = render("summary-box", {
      heading: "Key takeaways",
      html: "<ul><li>One</li></ul>",
    });
    expect(document.querySelector("aside.summary-box .summary-box-body ul li").textContent)
      .toBe("One");
  });

  it("appends params.classes", () => {
    const { document } = render("summary-box", {
      heading: "Key takeaways",
      classes: "blue",
    });
    expect(document.querySelector("aside.summary-box.blue")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("summary-box", {
      heading: "Key takeaways",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("aside.summary-box").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("summary-box", { heading: "Key takeaways" });
    expect(html).not.toContain("<style");
  });
});
