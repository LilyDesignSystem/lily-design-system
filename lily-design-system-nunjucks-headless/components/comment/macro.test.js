import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("comment", () => {
  it("renders an <article> with author, time, and body", () => {
    const { document } = render("comment", {
      author: "Alex",
      time: "2026-04-20T10:00:00Z",
      timeText: "10:00am",
      text: "Helpful info.",
    });
    expect(document.querySelector("article.comment")).toBeTruthy();
    expect(document.querySelector(".comment-author").textContent.trim())
      .toBe("Alex");
    expect(document.querySelector(".comment-time").getAttribute("datetime"))
      .toBe("2026-04-20T10:00:00Z");
    expect(document.querySelector(".comment-body").textContent.trim())
      .toBe("Helpful info.");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("comment", { author: "x", text: "y" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
