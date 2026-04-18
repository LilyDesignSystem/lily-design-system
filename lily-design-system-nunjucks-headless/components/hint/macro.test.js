import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("hint", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("hint", { text: "It is a 10-digit number." });
    const el = document.querySelector("div");
    expect(el).toBeTruthy();
    expect(el.classList.contains("hint")).toBe(true);
  });

  it("escapes params.text", () => {
    const { document } = render("hint", { text: "A & B" });
    expect(document.querySelector("div").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("hint", { html: "<em>Optional</em>" });
    expect(document.querySelector("div em")).toBeTruthy();
  });

  it("sets id from params.id for aria-describedby linkage", () => {
    const { document } = render("hint", {
      text: "x",
      id: "nhs-number-hint",
    });
    expect(document.querySelector("div").getAttribute("id"))
      .toBe("nhs-number-hint");
  });

  it("appends params.classes", () => {
    const { document } = render("hint", { text: "x", classes: "inline" });
    expect(document.querySelector("div.hint.inline")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("hint", {
      text: "x",
      attributes: { "data-source": "form" },
    });
    expect(document.querySelector("div").getAttribute("data-source"))
      .toBe("form");
  });

  it("renders caller block content", () => {
    const { document } = render("hint", {}, "<em>Hint</em>");
    expect(document.querySelector("div em").textContent).toBe("Hint");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("hint", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
