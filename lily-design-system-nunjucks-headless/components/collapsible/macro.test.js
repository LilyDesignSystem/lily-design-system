import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("collapsible", () => {
  it("renders a <details> with <summary> and body", () => {
    const { document } = render("collapsible", {
      summary: "More info",
      text: "Body content",
    });
    expect(document.querySelector("details.collapsible")).toBeTruthy();
    expect(document.querySelector("summary.collapsible-summary").textContent.trim())
      .toBe("More info");
    expect(document.querySelector(".collapsible-body").textContent.trim())
      .toBe("Body content");
  });

  it("supports open and name", () => {
    const { document } = render("collapsible", {
      summary: "x",
      open: true,
      name: "only-one",
    });
    const d = document.querySelector("details");
    expect(d.hasAttribute("open")).toBe(true);
    expect(d.getAttribute("name")).toBe("only-one");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("collapsible", { summary: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
