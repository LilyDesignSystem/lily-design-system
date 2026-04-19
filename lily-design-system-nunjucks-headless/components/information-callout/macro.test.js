import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("information-callout", () => {
  it("renders a <div> with the base class and role=note", () => {
    const { document } = render("information-callout", { text: "Info" });
    const el = document.querySelector("div.information-callout");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("note");
  });

  it("renders the heading at level 3 by default", () => {
    const { document } = render("information-callout", {
      heading: "Useful",
      text: "x",
    });
    const h = document.querySelector("div.information-callout h3");
    expect(h).toBeTruthy();
    expect(h.textContent.trim()).toBe("Useful");
    expect(h.classList.contains("information-callout-label")).toBe(true);
  });

  it("respects a custom heading level", () => {
    const { document } = render("information-callout", {
      heading: "Useful",
      headingLevel: 2,
      text: "x",
    });
    expect(document.querySelector("div.information-callout h2")).toBeTruthy();
  });

  it("wraps params.text in a <p>", () => {
    const { document } = render("information-callout", {
      text: "Message",
    });
    const p = document.querySelector("div.information-callout p");
    expect(p).toBeTruthy();
    expect(p.textContent.trim()).toBe("Message");
  });

  it("renders params.html raw", () => {
    const { document } = render("information-callout", {
      heading: "x",
      html: "<ul><li>one</li></ul>",
    });
    expect(document.querySelector("div.information-callout ul li")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("information-callout", {
      text: "x",
      classes: "narrow",
    });
    expect(document.querySelector("div.information-callout.narrow")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("information-callout", {
      text: "x",
      label: "Useful",
    });
    expect(
      document.querySelector("div.information-callout").getAttribute("aria-label"),
    ).toBe("Useful");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("information-callout", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
