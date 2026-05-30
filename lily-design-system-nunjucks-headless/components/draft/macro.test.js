import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("draft", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("draft", { text: "Working title" });
    const el = document.querySelector("div.draft");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("Working title");
  });

  it("applies aria-label when label is provided", () => {
    const { document } = render("draft", { label: "Draft article", text: "x" });
    expect(document.querySelector("div.draft").getAttribute("aria-label"))
      .toBe("Draft article");
  });

  it("applies data-status when status is provided", () => {
    const { document } = render("draft", { status: "in-progress", text: "x" });
    expect(document.querySelector("div.draft").getAttribute("data-status"))
      .toBe("in-progress");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("draft", { text: "y" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
