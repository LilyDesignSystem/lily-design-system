import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("details", () => {
  it("renders a <details> with the base class", () => {
    const { document } = render("details", {
      summary: "More info",
      text: "Body",
    });
    const el = document.querySelector("details");
    expect(el).toBeTruthy();
    expect(el.classList.contains("details")).toBe(true);
  });

  it("renders a <summary> with the summary text", () => {
    const { document } = render("details", {
      summary: "Where can I find my NHS number?",
      text: "Body",
    });
    const summary = document.querySelector("details summary.details-summary");
    expect(summary).toBeTruthy();
    expect(summary.textContent).toContain("Where can I find my NHS number?");
  });

  it("renders body text inside <div class='details-text'>", () => {
    const { document } = render("details", {
      summary: "x",
      text: "Body text",
    });
    const body = document.querySelector("details .details-text p");
    expect(body).toBeTruthy();
    expect(body.textContent.trim()).toBe("Body text");
  });

  it("renders params.html raw in the body", () => {
    const { document } = render("details", {
      summary: "x",
      html: "<ul><li>one</li></ul>",
    });
    expect(document.querySelector("details .details-text ul li")).toBeTruthy();
  });

  it("applies the open attribute when params.open is true", () => {
    const { document } = render("details", {
      summary: "x",
      text: "y",
      open: true,
    });
    expect(document.querySelector("details").hasAttribute("open")).toBe(true);
  });

  it("omits the open attribute when params.open is falsy", () => {
    const { document } = render("details", { summary: "x", text: "y" });
    expect(document.querySelector("details").hasAttribute("open")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("details", {
      summary: "x",
      text: "y",
      classes: "expander",
    });
    expect(document.querySelector("details.details.expander")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("details", {
      summary: "x",
      text: "y",
      attributes: { "data-module": "details" },
    });
    expect(document.querySelector("details").getAttribute("data-module"))
      .toBe("details");
  });

  it("renders caller block content in the body", () => {
    const { document } = render("details", { summary: "x" }, "<p>Call</p>");
    expect(document.querySelector("details .details-text p").textContent)
      .toBe("Call");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("details", { summary: "x", text: "y" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
