import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("warning-callout", () => {
  it("renders a <div> with the base class and role=note", () => {
    const { document } = render("warning-callout", { text: "Be careful" });
    const el = document.querySelector("div.warning-callout");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("note");
  });

  it("renders the heading at level 3 by default", () => {
    const { document } = render("warning-callout", {
      heading: "Important",
      text: "x",
    });
    const h = document.querySelector("div.warning-callout h3");
    expect(h).toBeTruthy();
    expect(h.textContent.trim()).toBe("Important");
    expect(h.classList.contains("warning-callout-label")).toBe(true);
  });

  it("respects a custom heading level", () => {
    const { document } = render("warning-callout", {
      heading: "Important",
      headingLevel: 2,
      text: "x",
    });
    expect(document.querySelector("div.warning-callout h2")).toBeTruthy();
    expect(document.querySelector("div.warning-callout h3")).toBeNull();
  });

  it("wraps params.text in a <p>", () => {
    const { document } = render("warning-callout", {
      heading: "x",
      text: "Message",
    });
    const p = document.querySelector("div.warning-callout p");
    expect(p).toBeTruthy();
    expect(p.textContent.trim()).toBe("Message");
  });

  it("renders params.html raw below the heading", () => {
    const { document } = render("warning-callout", {
      heading: "x",
      html: "<ul><li>one</li></ul>",
    });
    expect(document.querySelector("div.warning-callout ul li")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("warning-callout", {
      text: "x",
      classes: "narrow",
    });
    expect(document.querySelector("div.warning-callout.narrow")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("warning-callout", { text: "x", label: "Warning" });
    expect(document.querySelector("div.warning-callout").getAttribute("aria-label"))
      .toBe("Warning");
  });

  it("renders caller block content when no text or html is set", () => {
    const { document } = render("warning-callout", { heading: "x" }, "<p>Call</p>");
    expect(document.querySelector("div.warning-callout p").textContent).toBe("Call");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("warning-callout", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
