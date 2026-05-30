import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("question", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("question", { text: "What is your name?" });
    const el = document.querySelector("div.question");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("What is your name?");
  });

  it("applies aria-label when label is provided", () => {
    const { document } = render("question", { label: "Survey question", text: "x" });
    expect(document.querySelector("div.question").getAttribute("aria-label"))
      .toBe("Survey question");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("question", { text: "y" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
