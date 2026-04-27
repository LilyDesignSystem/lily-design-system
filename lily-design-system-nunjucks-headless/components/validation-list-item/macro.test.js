import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("validation-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("validation-list-item", { text: "At least 8 chars" });
    expect(document.querySelector("li.validation-list-item")).toBeTruthy();
  });

  it("renders the text content", () => {
    const { document } = render("validation-list-item", { text: "At least 8 chars" });
    expect(document.querySelector("li.validation-list-item").textContent.trim())
      .toBe("At least 8 chars");
  });

  it("defaults data-status to 'pending'", () => {
    const { document } = render("validation-list-item", { text: "rule" });
    expect(document.querySelector("li.validation-list-item").getAttribute("data-status"))
      .toBe("pending");
  });

  it("renders data-status='passed' when status is 'passed'", () => {
    const { document } = render("validation-list-item", {
      text: "rule",
      status: "passed",
    });
    expect(document.querySelector("li.validation-list-item").getAttribute("data-status"))
      .toBe("passed");
  });

  it("renders data-status='failed' when status is 'failed'", () => {
    const { document } = render("validation-list-item", {
      text: "rule",
      status: "failed",
    });
    expect(document.querySelector("li.validation-list-item").getAttribute("data-status"))
      .toBe("failed");
  });

  it("renders aria-label when provided", () => {
    const { document } = render("validation-list-item", {
      text: "rule",
      label: "Password length requirement",
    });
    expect(document.querySelector("li.validation-list-item").getAttribute("aria-label"))
      .toBe("Password length requirement");
  });

  it("omits aria-label when not provided", () => {
    const { document } = render("validation-list-item", { text: "rule" });
    expect(document.querySelector("li.validation-list-item").hasAttribute("aria-label"))
      .toBe(false);
  });

  it("renders raw html via params.html", () => {
    const { document } = render("validation-list-item", {
      html: "<strong>rule</strong>",
    });
    expect(document.querySelector("li.validation-list-item strong")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "validation-list-item",
      {},
      "<em>caller</em>",
    );
    expect(document.querySelector("li.validation-list-item em").textContent)
      .toBe("caller");
  });

  it("appends params.classes", () => {
    const { document } = render("validation-list-item", {
      text: "rule",
      classes: "compact",
    });
    expect(document.querySelector("li.validation-list-item.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("validation-list-item", {
      text: "rule",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("li.validation-list-item").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("validation-list-item", { text: "rule" });
    expect(html).not.toContain("<style");
  });
});
