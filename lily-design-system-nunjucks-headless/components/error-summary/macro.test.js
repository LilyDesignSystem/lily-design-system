import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("error-summary", () => {
  it("renders a <div> with the base class, role=alert, tabindex=-1", () => {
    const { document } = render("error-summary", {
      errors: [{ text: "Fix it", href: "#f" }],
    });
    const el = document.querySelector("div.error-summary");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("alert");
    expect(el.getAttribute("tabindex")).toBe("-1");
  });

  it("uses the default title and links via aria-labelledby", () => {
    const { document } = render("error-summary", {
      errors: [{ text: "x", href: "#x" }],
    });
    const h = document.querySelector("h2.error-summary-title");
    expect(h).toBeTruthy();
    expect(h.textContent).toBe("There is a problem");
    expect(h.getAttribute("id")).toBe("error-summary-title");
    expect(
      document.querySelector("div.error-summary").getAttribute("aria-labelledby"),
    ).toBe("error-summary-title");
  });

  it("respects a custom title and titleId", () => {
    const { document } = render("error-summary", {
      title: "Check your answers",
      titleId: "my-title",
      errors: [{ text: "x", href: "#x" }],
    });
    const h = document.querySelector("h2.error-summary-title");
    expect(h.textContent).toBe("Check your answers");
    expect(h.getAttribute("id")).toBe("my-title");
    expect(
      document.querySelector("div.error-summary").getAttribute("aria-labelledby"),
    ).toBe("my-title");
  });

  it("renders a description paragraph when provided", () => {
    const { document } = render("error-summary", {
      description: "Please review the fields below.",
      errors: [{ text: "x", href: "#x" }],
    });
    const p = document.querySelector(".error-summary-body p");
    expect(p).toBeTruthy();
    expect(p.textContent.trim()).toBe("Please review the fields below.");
  });

  it("renders each error as a list item link", () => {
    const { document } = render("error-summary", {
      errors: [
        { text: "Enter a name", href: "#name" },
        { text: "Enter an email", href: "#email" },
      ],
    });
    const items = document.querySelectorAll(".error-summary-list li a");
    expect(items.length).toBe(2);
    expect(items[0].getAttribute("href")).toBe("#name");
    expect(items[0].textContent).toBe("Enter a name");
    expect(items[1].getAttribute("href")).toBe("#email");
  });

  it("renders an error as plain text when href is missing", () => {
    const { document } = render("error-summary", {
      errors: [{ text: "Something went wrong" }],
    });
    const li = document.querySelector(".error-summary-list li");
    expect(li.textContent.trim()).toBe("Something went wrong");
    expect(li.querySelector("a")).toBeNull();
  });

  it("renders caller block when no errors are passed", () => {
    const { document } = render(
      "error-summary",
      {},
      '<ul><li>Custom</li></ul>',
    );
    expect(document.querySelector(".error-summary-body ul li").textContent)
      .toBe("Custom");
  });

  it("appends params.classes", () => {
    const { document } = render("error-summary", {
      errors: [{ text: "x", href: "#x" }],
      classes: "compact",
    });
    expect(document.querySelector("div.error-summary.compact")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("error-summary", {
      errors: [{ text: "x", href: "#x" }],
    });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
