import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("call-to-action", () => {
  it("renders a <div role=region> with heading and text", () => {
    const { document } = render("call-to-action", {
      heading: "Book today",
      text: "Book an appointment online.",
    });
    const el = document.querySelector("div.call-to-action");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-label")).toBe("Book today");
    expect(document.querySelector(".call-to-action-heading").textContent.trim())
      .toBe("Book today");
    expect(document.querySelector(".call-to-action-text").textContent.trim())
      .toBe("Book an appointment online.");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("call-to-action", { heading: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
