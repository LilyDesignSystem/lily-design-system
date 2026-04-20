import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("timer-button", () => {
  it("renders a <button> with duration data", () => {
    const { document } = render("timer-button", {
      text: "Submit",
      duration: 30,
    });
    const el = document.querySelector("button.timer-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-duration")).toBe("30");
    expect(el.querySelector(".timer-button-text").textContent.trim())
      .toBe("Submit");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("timer-button", { text: "x", duration: 5 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
