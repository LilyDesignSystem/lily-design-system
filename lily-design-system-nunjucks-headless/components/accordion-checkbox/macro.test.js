import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("accordion-checkbox", () => {
  it("renders a <div> with class accordion-checkbox", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show options",
      text: "Body",
    });
    const root = document.querySelector("div.accordion-checkbox");
    expect(root).toBeTruthy();
  });

  it("renders an <input type=\"checkbox\"> with class accordion-checkbox-input", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      text: "Body",
    });
    const input = document.querySelector(
      ".accordion-checkbox > input.accordion-checkbox-input"
    );
    expect(input).toBeTruthy();
    expect(input.getAttribute("type")).toBe("checkbox");
  });

  it("links the label for to the checkbox id", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show options",
      text: "Body",
    });
    const input = document.querySelector(".accordion-checkbox-input");
    const label = document.querySelector(".accordion-checkbox-label");
    expect(label.getAttribute("for")).toBe(input.getAttribute("id"));
    expect(label.textContent).toContain("Show options");
  });

  it("sets aria-controls on the checkbox to the panel id", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      text: "Body",
    });
    const input = document.querySelector(".accordion-checkbox-input");
    const panel = document.querySelector(".accordion-checkbox-panel");
    expect(input.getAttribute("aria-controls")).toBe(panel.getAttribute("id"));
  });

  it("sets role=region and aria-labelledby on the panel", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      text: "Body",
    });
    const input = document.querySelector(".accordion-checkbox-input");
    const panel = document.querySelector(".accordion-checkbox-panel");
    expect(panel.getAttribute("role")).toBe("region");
    expect(panel.getAttribute("aria-labelledby")).toBe(input.getAttribute("id"));
  });

  it("uses <id>-checkbox and <id>-panel as the linked ids", () => {
    const { document } = render("accordion-checkbox", {
      id: "comments",
      label: "Show",
      text: "Body",
    });
    expect(document.querySelector(".accordion-checkbox-input").getAttribute("id")).toBe(
      "comments-checkbox"
    );
    expect(document.querySelector(".accordion-checkbox-panel").getAttribute("id")).toBe(
      "comments-panel"
    );
  });

  it("hides the panel and sets aria-expanded=false when not checked", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      text: "Body",
    });
    const input = document.querySelector(".accordion-checkbox-input");
    const panel = document.querySelector(".accordion-checkbox-panel");
    expect(input.hasAttribute("checked")).toBe(false);
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hasAttribute("hidden")).toBe(true);
  });

  it("reveals the panel and sets aria-expanded=true when checked", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      text: "Body",
      checked: true,
    });
    const input = document.querySelector(".accordion-checkbox-input");
    const panel = document.querySelector(".accordion-checkbox-panel");
    expect(input.hasAttribute("checked")).toBe(true);
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(panel.hasAttribute("hidden")).toBe(false);
  });

  it("renders params.text inside the panel as a paragraph", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      text: "Body text",
      checked: true,
    });
    const p = document.querySelector(".accordion-checkbox-panel p");
    expect(p).toBeTruthy();
    expect(p.textContent.trim()).toBe("Body text");
  });

  it("renders params.html raw in the panel", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      html: "<ul><li>one</li></ul>",
      checked: true,
    });
    expect(
      document.querySelector(".accordion-checkbox-panel ul li")
    ).toBeTruthy();
  });

  it("renders caller block content in the panel", () => {
    const { document } = render(
      "accordion-checkbox",
      { id: "demo", label: "Show", checked: true },
      "<p>Call</p>"
    );
    expect(
      document.querySelector(".accordion-checkbox-panel p").textContent
    ).toBe("Call");
  });

  it("appends params.classes to the root div", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      text: "Body",
      classes: "extra",
    });
    expect(
      document.querySelector("div.accordion-checkbox.extra")
    ).toBeTruthy();
  });

  it("renders params.attributes on the root div", () => {
    const { document } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      text: "Body",
      attributes: { "data-module": "accordion-checkbox" },
    });
    expect(
      document
        .querySelector("div.accordion-checkbox")
        .getAttribute("data-module")
    ).toBe("accordion-checkbox");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("accordion-checkbox", {
      id: "demo",
      label: "Show",
      text: "Body",
    });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
